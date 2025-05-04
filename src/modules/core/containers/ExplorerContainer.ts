import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { panesCurrentContentsSelector, uuid } from 'edikit'
import { ITreeNode } from '../components/Tree'
import { IApplicationState } from '../../../store'
import { getMappingUrl, IMapping, loadServerMappings } from '../../mappings'
import { IServer } from '../../servers'
import Explorer from '../../../../src/modules/core/components/Explorer'

const mapStateToProps = (
    {
        panes,
        servers: {servers},
        mappings: serversMappings,
    }: IApplicationState
): {
    tree: ITreeNode
    servers: IServer[]
} => {
    const currentContentIds: string[] = panesCurrentContentsSelector(panes, 'default')
        .map(({id}) => id)

    const tree: ITreeNode = {
        id: 'root',
        type: 'root',
        label: 'servers',
        children: []
    }

    servers.forEach(server => {

        const serverNode = {
            id: server.name,
            label: server.name,
            type: 'server',
            children: [] as ITreeNode[],
        }

        const mappings = serversMappings[server.name]

        if (mappings !== undefined) {
            const creationId = uuid()
            serverNode.children.push({
                id: `${server.name}.mapping.create.${creationId}`,
                type: 'mapping.create',
                label: 'create mapping',
                data: {
                    serverName: server.name,
                    creationId,
                },
            })

            const mappingsNode: ITreeNode = {
                id: `${server.name}.mappings`,
                type: 'mappings',
                isLoading: mappings.isLoading,
                label: 'mappings',
                data: {
                    serverName: server.name,
                },
                children: [],
            }

            const findFolderNode = (currentNode: ITreeNode, folderPath: string | undefined): ITreeNode | undefined => {
                if (currentNode.id === `${server.name}.mappings.${folderPath}`) return currentNode;
                if (currentNode.children === undefined) return undefined;
                for (const child of currentNode.children!) {
                    const res = findFolderNode(child, folderPath);
                    if (res) return res;
                }
                return undefined;
            }

            const createFolderNode = (currentNode: ITreeNode, folderName: string, folderPath: string): ITreeNode => {
                const node: ITreeNode = {
                    id: `${server.name}.mappings.${folderPath}`,
                    type: 'mappings',
                    label: folderName,
                    data: {
                        serverName: server.name,
                    },
                    children: [],
                }
                currentNode.children!.push(node);
                return node;
            }

            const addToFolder = (folder: string | undefined, mappingNode: ITreeNode) => {
                let currentNode = mappingsNode;
                folder!.split('/').forEach((folderName, index, array) => {
                    const folderPath = array.filter((p, ix) => ix <= index).join('.');
                    const folderNode = findFolderNode(currentNode, folderPath);
                    if (!folderNode) {
                        currentNode = createFolderNode(currentNode, folderName, folderPath)
                    } else {
                        currentNode = folderNode
                    }
                    if (index === array.length - 1) currentNode.children!.push(mappingNode)
                })
            }
            const sortByName = (mappingNode: ITreeNode) => {
                const children = mappingNode.children || [];
                mappingNode.children = children.sort((a: ITreeNode, b: ITreeNode): number => {
                    if (a.label > b.label) return 1;
                    if (a.label < b.label) return -1;
                    return 0;
                })
                children.forEach(child => sortByName(child))
            }

            mappings.ids.forEach(mappingId => {
                const mapping = mappings.byId[mappingId].mapping
                if (mapping !== undefined) {
                    const mappingNode = {
                        id: mappingId,
                        type: 'mapping',
                        label: mapping.name || `${mapping.request.method} ${getMappingUrl(mapping)}`,
                        isCurrent: currentContentIds.includes(mappingId),
                        data: {
                            serverName: server.name,
                            mappingId,
                            name: mapping.name
                        },
                    };
                    if (hasFolder(mapping)) {
                        addToFolder(mapping.metadata!.folder, mappingNode);
                    } else {
                        mappingsNode.children!.push(mappingNode)
                    }
                }
            })
            sortByName(mappingsNode);
            serverNode.children.push(mappingsNode)
        }
        tree.children!.push(serverNode)
    })

    tree.children!.push({
        id: 'server.create',
        type: 'server.create',
        label: 'create server',
    })

    return {tree, servers}
}

function hasFolder(mapping: IMapping) {
    return mapping.metadata
        !== undefined
        && mapping.metadata!.folder
        !== undefined
        && mapping.metadata!.folder!.length > 0
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadServerMappings: (server: IServer) => {
        dispatch(loadServerMappings(server))
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explorer)
