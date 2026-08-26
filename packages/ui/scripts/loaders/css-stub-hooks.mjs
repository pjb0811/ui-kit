// Resolve/load hooks (run on the loader thread) that turn any `.css` specifier
// into an empty ES module. See css-stub.mjs for why.

const isCss = specifier => /\.css(\?.*)?$/.test(specifier) || /^swiper\/css/.test(specifier);

export async function resolve(specifier, context, nextResolve) {
  if (isCss(specifier)) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
