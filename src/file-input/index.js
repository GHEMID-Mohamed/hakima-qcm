import React, { Fragment } from 'react'
import CloseIcon from 'react-icons/lib/fa/close'
import FolderIcon from 'react-icons/lib/fa/folder-open'
import { Input, UncontrolledTooltip } from 'reactstrap'
import { map, filter, unionBy } from 'lodash'
import { injectState, provideState } from 'reaclette'

import { generateId } from '../utils'
import './style.css'

const MAX_FILE_UPLOAD = 20

const withState = provideState({
  initialState: () => ({
    filesSelected: [],
  }),
  effects: {
    clearSelectedFiles: () => state => ({
      ...state,
      filesSelected: [],
    }),
    uploadFiles: (effects, { target: { files } }) => (state, props) => {
      if (files.length + state.filesSelected.length > MAX_FILE_UPLOAD) {
        effects.setNotificationMessage(
          `You can't add more than ${MAX_FILE_UPLOAD} file${
            MAX_FILE_UPLOAD > 1 ? 's' : ''
          }`,
          'warning'
        )
        return { ...state }
      }
      const _filesSelected = unionBy(state.filesSelected, files, 'name')
      props.onSelectFiles(_filesSelected)
      return {
        ...state,
        filesSelected: _filesSelected,
      }
    },
    deleteFile: (_, fileName) => (state, props) => {
      const _filesSelected = filter(
        state.filesSelected,
        file => file.name !== fileName
      )
      props.onSelectFiles(_filesSelected)
      return {
        ...state,
        filesSelected: _filesSelected,
      }
    },
  },
})

const FileInput = ({ effects, state }) => (
  <Fragment>
    <span id="file-input-wrap">
      <span className="fileContainer">
        <FolderIcon /> &nbsp; Choisir l'examen en photos{' '}
        <Input
          name="attachments"
          id="file-input"
          type="file"
          accept="image/png, image/jpeg"
          onChange={effects.uploadFiles}
          multiple
        />
      </span>
    </span>
    &nbsp;
    <span>
      {map(state.filesSelected, (file, index) => (
        <div key={file.name} style={index === 0 ? { marginTop: '10px' } : {}}>
          <span className="text-muted">{file.name}</span>
          &nbsp;
          <CloseIcon
            style={{ cursor: 'pointer' }}
            onClick={() => effects.deleteFile(file.name)}
          />
          &nbsp; &nbsp;
        </div>
      ))}
    </span>
  </Fragment>
)

export default withState(injectState(FileInput))
