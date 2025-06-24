// Potrebno da TypeScript ne prijavljuje grešku pri importovanju .vue fajlova
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
