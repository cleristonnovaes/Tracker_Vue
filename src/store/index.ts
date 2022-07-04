import { INotificacao } from "@/interfaces/INotificacao";
    import { InjectionKey } from "vue";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { ALTERAR_TAREFA, CADASTRAR_TAREFA, OBTER_TAREFAS } from "./tipo-acoes";
import { ADICIONA_TAREFA, ALTERA_TAREFA, DEFINIR_TAREFAS, NOTIFICAR } from "./tipo-mutacoes";
import http from '@/http'
import ITarefa from "@/interfaces/ITarefa";
import { EstadoProjeto, projeto } from "./modulos/projeto";

export interface Estado{
    projeto: EstadoProjeto
    notificacoes: INotificacao[],
    tarefas: ITarefa[]
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
    state:{
        projeto: {
            projetos: []
        } ,
        notificacoes:[],
        tarefas: []
    },
    mutations:{
       
        [DEFINIR_TAREFAS](state, tarefa : ITarefa[]){
            state.tarefas = tarefa
        },
        [ADICIONA_TAREFA](state, tarefa: ITarefa){
            state.tarefas.push(tarefa)
        },
        [ALTERA_TAREFA](state, tarefa: ITarefa){
            const index = state.tarefas.findIndex(tar => tar.id == tarefa.id)
            state.tarefas[index] = tarefa
        },
        [NOTIFICAR](state, novaNotificacao: INotificacao){
            novaNotificacao.id = new Date().getTime();
            state.notificacoes.push(novaNotificacao);

            setTimeout(() =>{
                state.notificacoes = state.notificacoes.filter(notificacao => notificacao.id != novaNotificacao.id)
            }, 3000)
        }
    },
    actions:{
        
        [OBTER_TAREFAS]({commit}){
            http.get('tarefas')
                .then(resposta => commit(DEFINIR_TAREFAS, resposta.data))
        },
        [CADASTRAR_TAREFA]({commit}, tarefa: ITarefa){
            return http.post('/tarefas', tarefa)
                        .then(resposta => commit(ADICIONA_TAREFA, resposta.data))
        },
        [ALTERAR_TAREFA]({commit}, tarefa: ITarefa){
            return http.put(`/tarefas/${tarefa.id}`,tarefa)
                       .then(() => commit(ALTERA_TAREFA, tarefa))
        },
    },
    modules:{
        projeto
    }

})

export function useStore(): Store<Estado>{
    return vuexUseStore(key)
}