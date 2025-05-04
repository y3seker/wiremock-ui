import { combineEpics, Epic } from 'redux-observable'
import { EMPTY, from, of } from 'rxjs'
import { catchError, flatMap, map, mergeMap } from 'rxjs/operators'
import { omit } from 'lodash'
import { addContentToCurrentPaneAction, removeContentFromAllPanesAction } from 'edikit'
import { createMapping, deleteMapping, getMapping, getMappings, updateMapping, } from '../../../api'
import { IApplicationState } from '../../../store'
import {
    createMappingError,
    createMappingSuccess,
    deleteMappingError,
    deleteMappingSuccess,
    fetchMappingError,
    fetchMappingSuccess,
    ICreateMappingRequestAction,
    IDeleteMappingRequestAction,
    IFetchMappingRequestAction,
    ILoadServerMappingsAction,
    ILoadServerMappingsRequestAction,
    IUpdateMappingRequestAction,
    loadServerMappingsError,
    loadServerMappingsRequest,
    loadServerMappingsSuccess,
    MappingsAction,
    updateMappingError,
    updateMappingSuccess,
} from './actions'
import { IMapping } from '../types'
import { MappingsActionTypes } from './types'

export const shouldLoadServerMappingsEpic: Epic<MappingsAction, any, IApplicationState> = (action$, state$) =>
    action$.ofType(MappingsActionTypes.LOAD_SERVER_MAPPINGS)
        .pipe(
            mergeMap(({payload}: ILoadServerMappingsAction) => {
                const serversMappings = state$.value.mappings
                const entry = serversMappings[payload.server.name]
                if (entry !== undefined) {
                    if (entry.isLoading || entry.haveBeenLoaded) {
                        return EMPTY
                    }
                }

                return of(loadServerMappingsRequest(payload.server))
            })
        )

export const loadServerMappingsEpic: Epic<MappingsAction, any, IApplicationState> = (action$, state$) =>
    action$.ofType(MappingsActionTypes.LOAD_SERVER_MAPPINGS_REQUEST)
        .pipe(
            mergeMap(({payload}: ILoadServerMappingsRequestAction) =>
                getMappings(payload.server).pipe(
                    map(({mappings}) => loadServerMappingsSuccess(
                        payload.server,
                        mappings
                    )),
                    catchError(err => of(loadServerMappingsError(payload.server, err.message)))
                )
            )
        )

export const fetchMappingsEpic: Epic<MappingsAction, any, IApplicationState> = (action$, state$) =>
    action$.ofType(MappingsActionTypes.FETCH_MAPPING_REQUEST)
        .pipe(
            mergeMap(({payload}: IFetchMappingRequestAction) => {
                const server = state$.value.servers.servers.find(
                    s => s.name === payload.serverName
                )
                if (server === undefined) return EMPTY

                return getMapping(server, payload.mappingId).pipe(
                    map((mapping: IMapping) => fetchMappingSuccess(
                        payload.serverName,
                        payload.mappingId,
                        mapping
                    )),
                    catchError(err => of(fetchMappingError(payload.serverName, payload.mappingId, err.message)))
                )
            })
        )

export const createMappingEpic: Epic<MappingsAction, any, IApplicationState> = (action$, state$) =>
    action$.ofType(MappingsActionTypes.CREATE_MAPPING_REQUEST)
        .pipe(
            flatMap(({payload}: ICreateMappingRequestAction) => {
                const server = state$.value.servers.servers.find(
                    s => s.name === payload.serverName
                )
                if (server === undefined) return EMPTY

                return createMapping(server, omit(payload.mapping, ['id', 'uuid'])).pipe(
                    mergeMap(({response: mapping}) => from([
                        removeContentFromAllPanesAction(
                            'default',
                            `${server.name}.mapping.create.${payload.creationId}`,
                        ),
                        createMappingSuccess(
                            payload.serverName,
                            mapping.id,
                            payload.creationId,
                            mapping
                        ),
                        catchError(err => of(createMappingError(
                            payload.serverName,
                            mapping.id,
                            payload.creationId,
                            mapping,
                            err.message))
                        ),
                        addContentToCurrentPaneAction(
                            'default',
                            {
                                id: mapping.id,
                                type: 'mapping',
                                isCurrent: true,
                                isUnique: false,
                                data: {
                                    serverName: server.name,
                                    mappingId: mapping.id,
                                    name: mapping.name
                                },
                            }
                        ),
                    ]))
                )
            })
        )

export const updateMappingEpic: Epic<MappingsAction, any, IApplicationState> = (action$, state$) =>
    action$.ofType(MappingsActionTypes.UPDATE_MAPPING_REQUEST)
        .pipe(
            flatMap(({payload}: IUpdateMappingRequestAction) => {
                const server = state$.value.servers.servers.find(
                    s => s.name === payload.serverName
                )
                if (server === undefined) return EMPTY

                return updateMapping(server, payload.mapping).pipe(
                    map(({response: mapping}) => updateMappingSuccess(
                        payload.serverName,
                        payload.mappingId,
                        mapping
                    )),
                    catchError(err => of(updateMappingError(
                        payload.serverName,
                        payload.mappingId,
                        payload.mapping,
                        err.message
                    )))
                )
            })
        )

export const deleteMappingEpic: Epic<MappingsAction, any, IApplicationState> = (action$, state$) =>
    action$.ofType(MappingsActionTypes.DELETE_MAPPING_REQUEST)
        .pipe(
            mergeMap(({payload}: IDeleteMappingRequestAction) => {
                const server = state$.value.servers.servers.find(
                    s => s.name === payload.serverName
                )
                if (server === undefined) return EMPTY

                return deleteMapping(server, payload.mappingId).pipe(
                    mergeMap(() => from([
                        removeContentFromAllPanesAction(
                            'default',
                            payload.mappingId,
                        ),
                        deleteMappingSuccess(
                            payload.serverName,
                            payload.mappingId
                        ),
                        catchError(err => of(deleteMappingError(payload.serverName, payload.mappingId, err.message)))
                    ]))
                )
            })
        )

export const mappingsEpic = combineEpics(
    shouldLoadServerMappingsEpic,
    loadServerMappingsEpic,
    fetchMappingsEpic,
    createMappingEpic,
    updateMappingEpic,
    deleteMappingEpic
)
