import * as React from 'react'
import { Block, Input } from 'edikit'
import { FormikErrors, FormikTouched } from 'formik'
import { IMappingFormValues } from '../../types'
import BuilderSectionLabel from './BuilderSectionLabel'
import { Grid } from './Builder_styled'

interface IBuilderScenarioProps {
    isOpened: boolean

    onToggle(): void

    values: IMappingFormValues
    errors: FormikErrors<IMappingFormValues>
    touched: FormikTouched<IMappingFormValues>

    onChange(e: React.ChangeEvent<any>): void

    onBlur(e: any): void

    sync(): void
}

export default class BuilderScenario extends React.Component<IBuilderScenarioProps> {
    render() {
        const {
            isOpened,
            onToggle,
            values,
            errors,
            touched,
            onChange,
            onBlur,
            sync,
        } = this.props

        return (
            <React.Fragment>
                <BuilderSectionLabel
                    label="Metadata"
                    isOpened={isOpened}
                    onToggle={onToggle}
                />
                {isOpened && (
                    <Block withLink={true}>
                        <Grid>
                            <label
                                htmlFor="folder"
                                style={{
                                    gridColumnStart: 1,
                                    gridColumnEnd: 4,
                                    width: '100%'
                                }}
                            >Folder</label>
                            <Input
                                id="metadata.folder"
                                value={values.metadata!.folder}
                                onChange={onChange}
                                onBlur={onBlur}
                                style={{
                                    gridColumnStart: 1,
                                    gridColumnEnd: 9,
                                    width: '100%'
                                }}
                            />
                        </Grid>
                    </Block>
                )}
            </React.Fragment>
        )
    }
}
