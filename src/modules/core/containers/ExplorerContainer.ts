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
        mappings: serversMappings
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
                label: 'mappings',
                data: {
                    serverName: server.name,
                },
                children: [],
            }

            const findFolderNode = (currentNode: ITreeNode, folderName: string | undefined): ITreeNode | undefined => {
                if (currentNode.id === folderName) return currentNode;
                if (currentNode.children === undefined) return undefined;
                for (const child of currentNode.children!) {
                    const res = findFolderNode(child, folderName);
                    if (res) return res;
                }
                return undefined;
            }

            const createFolderNode = (currentNode: ITreeNode, folderName: string): ITreeNode => {
                const node: ITreeNode = {
                    id: folderName,
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
                    const folderNode = findFolderNode(currentNode, folderName);
                    if (!folderNode) {
                        currentNode = createFolderNode(currentNode, folderName)
                    } else {
                        currentNode = folderNode
                    }
                    if (index === array.length - 1) currentNode.children!.push(mappingNode)
                })
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
