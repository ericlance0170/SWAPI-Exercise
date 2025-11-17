import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export interface Starship{
    id: number;
    name: string;
    model: string;
    manufacturer: string;
    costInCredits: string;
    length: string;
    maxAtmospheringSpeed: string;
    crew: string;
    passengers: string;
    cargoCapacity: string;
    consumables: string;
    hyperdriveRating: string;
    mglt: string;
    starshipClass: string;
    pilots: string[];
    films: string[];
    created?: string;
    edited?: string;
    url?: string;
}

export const apiService = {
    fetchStarships: async(): Promise<Starship[]> =>{
        try{
            const response = await axios.get(`${API_BASE_URL}/starships`);
            return response.data;
        }
        catch(e) {
            console.error('Error FETCHing starships:', e);
            throw e;
        }
    },
    fetchStarshipsFromSWAPI: async(page?:number): Promise<Starship[]> =>{
        try{
            const url = page ? `${API_BASE_URL}/api/swapi/starships?page=${page}` : `${API_BASE_URL}/api/swapi/starships`;
            const response = await axios.get(url);
            return response.data;
        }
        catch(e) {
            console.error('Error FETCHing starships from SWAPI:', e);
            throw e;
        }
    },
    createStarship: async(starship: Starship): Promise<Starship> => {
        try{
            const response = await axios.post(`${API_BASE_URL}/starships`, starship);
            return response.data;
        }
        catch(e){
            console.error('Error creating starship:', e);
            throw e;
        }
    },
    updateStarship: async(id: number, starship: Starship): Promise<Starship> => {
        try{
            const response = await axios.put(`${API_BASE_URL}/starships/${id}`, starship);
            return response.data;
        }
        catch(e){
            console.error('Error updating starship: ', e);
            throw e;
        }
    },
    deleteStarship: async(id: number): Promise<void> => {
        try{
            await axios.delete(`${API_BASE_URL}/starships/${id}`);
        }
        catch(e){
            console.error('Error deleting starship:', e);
            throw e;
        }
    },
    syncShipsFromSWAPI: async(page?: number) =>{
        try{
            const url = page ? `${API_BASE_URL}/api/swapi/starships/sync?page=${page}` : `${API_BASE_URL}/api/swapi/starships/sync`;
            const response = await axios.post(url);
            return response.data;
        }
        catch(e){
            console.error('Error syncing starships:', e);
            throw e;
        }
    }
}