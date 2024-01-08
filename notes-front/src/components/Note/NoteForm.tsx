import React, { ChangeEvent, FormEvent } from "react";

import { INote } from "../../types/Note";

export interface INoteForm {
    note: INote,
    onChange: (propName: string, value: string) => void
    onSubmit: () => void
}

export const NoteForm: React.FC<INoteForm> = (props) => {
    const {
        note,
        onChange,
        onSubmit
    } = props

    const onSubmitForm = (e: FormEvent) => {
        e.preventDefault()
        onSubmit()
    }

    const onInputChange = (propName: keyof INote) => (e: ChangeEvent<HTMLInputElement>) => {
        onChange(propName, e.target.value)
    }

    return (
        <form onSubmit={onSubmitForm}>
            <p>
                <label>Title</label><br/>
                <input defaultValue={note.title} onChange={onInputChange('title')} />
            </p>
            <p>
                <label>Description</label><br/>
                <input defaultValue={note.description} onChange={onInputChange('description')} />
            </p>
            <button>Submit</button>
        </form>
    )
}