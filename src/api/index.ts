import { Building } from "../types/Building"
import { UploadFileFormValues } from "../types/UploadFileForm"

const BASE_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`

export const Api = {
    uploadFile: async function({ numberSheet, skipRow, DocumentType }: Partial<UploadFileFormValues>, formData: FormData) {
        const data = await fetch(`${BASE_URL}/v0/files/${numberSheet}/${skipRow}/${DocumentType}`, {
            method: "POST",
            body: formData
        })
        const json = await data.json()
        return json
    },
    getAreaBuildings: async function (): Promise<Building[]> {
        const data = await fetch(`${BASE_URL}/v0/addresses/`)
        const json = await data.json()
        return json
    },
    getAreaBuildingsByDate: async function (date: string): Promise<Building[]> {
        const data = await fetch(`${BASE_URL}/v0/predications/date/${date}`)
        const json = await data.json()
        return json
    }
}