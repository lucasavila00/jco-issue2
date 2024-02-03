function throwUninitialized() {
  throw new TypeError('Wasm uninitialized use `await $init` first');
}

const utf8Encoder = new TextEncoder();

let utf8EncodedLen = 0;
function utf8Encode(s, realloc, memory) {
  if (typeof s !== 'string') throw new TypeError('expected a string');
  if (s.length === 0) {
    utf8EncodedLen = 0;
    return 1;
  }
  let allocLen = 0;
  let ptr = 0;
  let writtenTotal = 0;
  while (s.length > 0) {
    ptr = realloc(ptr, allocLen, 1, allocLen += s.length * 2);
    const { read, written } = utf8Encoder.encodeInto(
    s,
    new Uint8Array(memory.buffer, ptr + writtenTotal, allocLen - writtenTotal),
    );
    writtenTotal += written;
    s = s.slice(read);
  }
  utf8EncodedLen = writtenTotal;
  return ptr;
}

export async function instantiate(getCoreModule, imports, instantiateCore = WebAssembly.instantiate) {
  const module0 = getCoreModule('rust_html_bindgen.core.wasm');
  
  let exports0;
  let memory0;
  let realloc0;
  ({ exports: exports0 } = await instantiateCore(await module0));
  memory0 = exports0.memory;
  realloc0 = exports0.cabi_realloc;
  
  function foo(arg0) {
    if (!_initialized) throwUninitialized();
    var ptr0 = utf8Encode(arg0, realloc0, memory0);
    var len0 = utf8EncodedLen;
    const ret = exports0.foo(ptr0, len0);
    return ret >>> 0;
  }
  
  return { foo,  };
}
