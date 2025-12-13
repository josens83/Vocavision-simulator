/**
 * Chapter 8: Save/Load & Persistence - Compression Utilities
 * 저장 데이터 압축/해제 유틸리티
 */

// ============================================
// LZ-String 기반 압축 (브라우저 호환)
// ============================================

/**
 * 문자열을 압축합니다.
 */
export async function compressData(data: string): Promise<string> {
  try {
    // CompressionStream API 사용 (모던 브라우저)
    if (typeof CompressionStream !== 'undefined') {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(data));
          controller.close();
        },
      });

      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const reader = compressedStream.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      // Base64로 인코딩
      return btoa(String.fromCharCode(...result));
    }

    // 폴백: LZ-String 스타일 압축
    return lzCompress(data);
  } catch (error) {
    console.warn('Compression failed, storing uncompressed:', error);
    return `RAW:${data}`;
  }
}

/**
 * 압축된 문자열을 해제합니다.
 */
export async function decompressData(compressed: string): Promise<string> {
  try {
    // RAW 데이터 처리
    if (compressed.startsWith('RAW:')) {
      return compressed.slice(4);
    }

    // CompressionStream API 사용 (모던 브라우저)
    if (typeof DecompressionStream !== 'undefined') {
      try {
        const binaryString = atob(compressed);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(bytes);
            controller.close();
          },
        });

        const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
        const reader = decompressedStream.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }

        const decoder = new TextDecoder();
        return chunks.map((chunk) => decoder.decode(chunk, { stream: true })).join('');
      } catch {
        // gzip 실패 시 LZ 압축 해제 시도
        return lzDecompress(compressed);
      }
    }

    // 폴백: LZ-String 스타일 압축 해제
    return lzDecompress(compressed);
  } catch (error) {
    console.error('Decompression failed:', error);
    throw new Error('저장 데이터 압축 해제에 실패했습니다.');
  }
}

// ============================================
// LZ-String 호환 압축 알고리즘
// ============================================

const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const keyStrUri = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';

function getBaseValue(alphabet: string, character: string): number {
  const index = alphabet.indexOf(character);
  if (index === -1) {
    throw new Error(`Invalid character: ${character}`);
  }
  return index;
}

/**
 * LZ-String 스타일 압축
 */
function lzCompress(uncompressed: string): string {
  if (uncompressed === '') return '';

  let context_dictionary: { [key: string]: number } = {};
  let context_dictionaryToCreate: { [key: string]: boolean } = {};
  let context_c = '';
  let context_wc = '';
  let context_w = '';
  let context_enlargeIn = 2;
  let context_dictSize = 3;
  let context_numBits = 2;
  let context_data: string[] = [];
  let context_data_val = 0;
  let context_data_position = 0;
  let ii: number;

  for (ii = 0; ii < uncompressed.length; ii++) {
    context_c = uncompressed.charAt(ii);
    if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
      context_dictionary[context_c] = context_dictSize++;
      context_dictionaryToCreate[context_c] = true;
    }

    context_wc = context_w + context_c;
    if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
      context_w = context_wc;
    } else {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (let i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1;
            if (context_data_position === 5) {
              context_data_position = 0;
              context_data.push(keyStrUri.charAt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          let value = context_w.charCodeAt(0);
          for (let i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === 5) {
              context_data_position = 0;
              context_data.push(keyStrUri.charAt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          let value = 1;
          for (let i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position === 5) {
              context_data_position = 0;
              context_data.push(keyStrUri.charAt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (let i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === 5) {
              context_data_position = 0;
              context_data.push(keyStrUri.charAt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn === 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        let value = context_dictionary[context_w];
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === 5) {
            context_data_position = 0;
            context_data.push(keyStrUri.charAt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn === 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      context_dictionary[context_wc] = context_dictSize++;
      context_w = String(context_c);
    }
  }

  if (context_w !== '') {
    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
      if (context_w.charCodeAt(0) < 256) {
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = context_data_val << 1;
          if (context_data_position === 5) {
            context_data_position = 0;
            context_data.push(keyStrUri.charAt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
        }
        let value = context_w.charCodeAt(0);
        for (let i = 0; i < 8; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === 5) {
            context_data_position = 0;
            context_data.push(keyStrUri.charAt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      } else {
        let value = 1;
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | value;
          if (context_data_position === 5) {
            context_data_position = 0;
            context_data.push(keyStrUri.charAt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = 0;
        }
        value = context_w.charCodeAt(0);
        for (let i = 0; i < 16; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === 5) {
            context_data_position = 0;
            context_data.push(keyStrUri.charAt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn === 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      delete context_dictionaryToCreate[context_w];
    } else {
      let value = context_dictionary[context_w];
      for (let i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position === 5) {
          context_data_position = 0;
          context_data.push(keyStrUri.charAt(context_data_val));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }
    }
    context_enlargeIn--;
    if (context_enlargeIn === 0) {
      context_numBits++;
    }
  }

  // 종료 마커
  let value = 2;
  for (let i = 0; i < context_numBits; i++) {
    context_data_val = (context_data_val << 1) | (value & 1);
    if (context_data_position === 5) {
      context_data_position = 0;
      context_data.push(keyStrUri.charAt(context_data_val));
      context_data_val = 0;
    } else {
      context_data_position++;
    }
    value = value >> 1;
  }

  // 남은 비트 플러시
  while (true) {
    context_data_val = context_data_val << 1;
    if (context_data_position === 5) {
      context_data.push(keyStrUri.charAt(context_data_val));
      break;
    } else {
      context_data_position++;
    }
  }

  return 'LZ:' + context_data.join('');
}

/**
 * LZ-String 스타일 압축 해제
 */
function lzDecompress(compressed: string): string {
  if (compressed === '') return '';

  // LZ 접두사 제거
  if (compressed.startsWith('LZ:')) {
    compressed = compressed.slice(3);
  }

  let dictionary: string[] = [];
  let next: number;
  let enlargeIn = 4;
  let dictSize = 4;
  let numBits = 3;
  let entry = '';
  let result: string[] = [];
  let i: number;
  let w: string;
  let c: string;
  let bits = 0;
  let resb: number;
  let maxpower: number;
  let power: number;
  let data_val = getBaseValue(keyStrUri, compressed.charAt(0));
  let data_position = 6;
  let data_index = 1;

  for (i = 0; i < 3; i++) {
    dictionary[i] = String(i);
  }

  maxpower = Math.pow(2, 2);
  power = 1;
  while (power !== maxpower) {
    resb = data_val & data_position;
    data_position >>= 1;
    if (data_position === 0) {
      data_position = 32;
      data_val = getBaseValue(keyStrUri, compressed.charAt(data_index++));
    }
    bits |= (resb > 0 ? 1 : 0) * power;
    power <<= 1;
  }

  next = bits;
  switch (next) {
    case 0:
      bits = 0;
      maxpower = Math.pow(2, 8);
      power = 1;
      while (power !== maxpower) {
        resb = data_val & data_position;
        data_position >>= 1;
        if (data_position === 0) {
          data_position = 32;
          data_val = getBaseValue(keyStrUri, compressed.charAt(data_index++));
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = String.fromCharCode(bits);
      break;
    case 1:
      bits = 0;
      maxpower = Math.pow(2, 16);
      power = 1;
      while (power !== maxpower) {
        resb = data_val & data_position;
        data_position >>= 1;
        if (data_position === 0) {
          data_position = 32;
          data_val = getBaseValue(keyStrUri, compressed.charAt(data_index++));
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = String.fromCharCode(bits);
      break;
    case 2:
      return '';
    default:
      return '';
  }
  dictionary[3] = c;
  w = c;
  result.push(c);

  while (true) {
    if (data_index > compressed.length) {
      return '';
    }

    bits = 0;
    maxpower = Math.pow(2, numBits);
    power = 1;
    while (power !== maxpower) {
      resb = data_val & data_position;
      data_position >>= 1;
      if (data_position === 0) {
        data_position = 32;
        data_val = getBaseValue(keyStrUri, compressed.charAt(data_index++));
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }

    c = '';
    switch ((next = bits)) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2, 8);
        power = 1;
        while (power !== maxpower) {
          resb = data_val & data_position;
          data_position >>= 1;
          if (data_position === 0) {
            data_position = 32;
            data_val = getBaseValue(keyStrUri, compressed.charAt(data_index++));
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = String.fromCharCode(bits);
        next = dictSize - 1;
        enlargeIn--;
        break;
      case 1:
        bits = 0;
        maxpower = Math.pow(2, 16);
        power = 1;
        while (power !== maxpower) {
          resb = data_val & data_position;
          data_position >>= 1;
          if (data_position === 0) {
            data_position = 32;
            data_val = getBaseValue(keyStrUri, compressed.charAt(data_index++));
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = String.fromCharCode(bits);
        next = dictSize - 1;
        enlargeIn--;
        break;
      case 2:
        return result.join('');
    }

    if (enlargeIn === 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }

    if (dictionary[next]) {
      entry = dictionary[next];
    } else {
      if (next === dictSize) {
        entry = w + w.charAt(0);
      } else {
        return '';
      }
    }
    result.push(entry);

    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn--;

    if (enlargeIn === 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }

    w = entry;
  }
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 데이터 크기를 사람이 읽기 쉬운 형식으로 변환
 */
export function formatDataSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * 압축률 계산
 */
export function calculateCompressionRatio(original: string, compressed: string): number {
  if (original.length === 0) return 0;
  return ((original.length - compressed.length) / original.length) * 100;
}
