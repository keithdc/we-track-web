import {Compiler, ComponentFactory, Injectable, Injector, NgModule, NgModuleFactory, Type} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadService {

  // https://medium.com/@ebrehault_25985/angular-9-makes-lazy-loading-without-routing-so-easy-18774092ed34
  // https://www.debugbear.com/blog/lazy-loading-angular-components-without-a-router
  // https://indepth.dev/lazy-loading-angular-modules-with-ivy
  // https://2ality.com/2017/01/import-operator.html
  // https://indepth.dev/here-is-what-you-need-to-know-about-dynamic-components-in-angular
  constructor(
    private compiler: Compiler,
    private injector: Injector,
  ) { }

  async compileModule<T>(t: Type<T>): Promise<NgModuleFactory<T>> {
    if (t instanceof NgModuleFactory) {
      return t;
    } else {
      return await this.compiler.compileModuleAsync(t);
    }
  }
  async resolveComponentFactories<M, C>(module: NgModule, components: Type<C>[]): Promise<ComponentFactory<C>[]> {
    const moduleFactory = await this.compileModule(module as Type<M>);
    const moduleRef = moduleFactory.create(this.injector);
    const factories: ComponentFactory<C>[] = [];
    components.forEach(component => {
      factories.push(moduleRef.componentFactoryResolver.resolveComponentFactory(component));
    });
    return factories;
  }

}
