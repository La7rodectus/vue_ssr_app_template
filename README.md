# vue_ssr_app_template
During my introduction with Vue, i noticed that there are no good exemples how to build an SSR app on Vue.v3.
So in this project i tried to make a universal and convenient template for development on the third version of the framework.
The example of Sebastien Chopin demonstrated at VueConf.US 2018 was taken as a basis.

## Built With
* Vue 3
* Vuex 4
* Vue router 4
* Babel
* Memory-fs
* Webpack
* Eslint
* JSDoc 3

## Scripts
* ``` build:client ``` - building client bundle to ./dist/client in dev mode
* ``` build:server ``` - building server bundle to ./dist/server in dev mode
* ``` build ``` - building both bundles in dev mode
* ``` start ``` - runs server
* ``` dev ``` - runs server in dev mode with HMR __all chenges in ram fs__
* ``` dev:fs ``` - runs server in dev mode with HMR __all chenges in ram fs and real one__ *
* ``` prod ``` - full build in prod mode 
* ``` lint ``` - check eslint errors & fix 
* ``` clear_win:dist ``` - removes ./dist on windows 
* ``` clear_uni:dist ``` - removes ./dist on linux 


