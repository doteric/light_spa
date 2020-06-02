function lazy(loader, placeholder = "") {
  let component;

  const load = () => {
    if (!component) {
      loader().then(module => {
        component = module.default;
      });
    }
  };

  const Load = state => [state, [load]];

  const LazyComponent = params => {
    return component ? component(params) : placeholder;
  };


  return {LazyComponent, Load};
}

export {lazy};