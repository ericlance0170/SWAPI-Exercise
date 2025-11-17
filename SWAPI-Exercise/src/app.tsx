import React, {useState, useEffect} from 'react';
import {Container, Button, Alert, Spinner, Row, Col} from 'react-bootstrap';
import {StarshipTable} from './components/starshipTable';
import {StarshipForm} from './components/starshipForm';
import { apiService, Starship } from './services/apiService';
import '/styles/app.css';

const App: React.FC = () => {
    const [starships, setStarships] = useState<Starship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingStarship, setEditingStarship] = useState<Starship | undefined>(undefined);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchStarships();
    }, []);

    const fetchStarships = async () => {
        try{
            setLoading(true);
            setError(null);
            const data = await apiService.fetchStarships();
            setStarships(data);
        }
        catch(e){
            setError('Oopsie. Failed to Load starships. Please try again.');
            console.error(e);
        }
        finally{
            setLoading(false);
        }
    };

    const handleSWAPISync = async (page?: number) => {
        try{
            setSyncing(true);
            setError(null);
            await apiService.syncShipsFromSWAPI(page);
            await fetchStarships();
        }
        catch(e){
            setError('Oopsie. Failed to Sync starships from SWAPI.');
            console.error(e);
        }
        finally{
            setSyncing(false);
        }
    };

    const openForm = (starship?: Starship) => {
        setEditingStarship(starship);
        setShowForm(true);
    };
    const closeForm = () => {
        setShowForm(false);
        setEditingStarship(undefined);
    };
    const formSubmit = async (starshipData: Starship) => {
        try{
            setFormLoading(true);
            setError(null);
            if(editingStarship?.id){
                await apiService.updateStarship(editingStarship.id, starshipData);
            }
            else{
                await apiService.createStarship(starshipData);
            }
            await fetchStarships();
            closeForm();
        }
        catch(e){
            setError(`Oopsie. Failed to ${editingStarship?.id ? 'update' : 'create'} starship.`);
            console.error(e);
        }
        finally{
            setFormLoading(false);
        }
    }

    const handleDelete = async (id:number) => {
        try{
            setDeleteLoading(id);
            setError(null);
            await apiService.deleteStarship(id);
            await fetchStarships();
        }
        catch(e){
            setError('Oopsie. Failed to delete starship.');
            console.error(e); 
        }
        finally{
            setDeleteLoading(null);
        }
    };

    return (
        <div className='app-container'>
            <header className='app-header mb-4 py-4 bg-dark text-white'>
                <Container>
                    <h1 className='mb-2'>Starship Explorer</h1>
                    <p className='mb-0'>View and manage Star Wars ships from SWAPI</p>
                </Container>
            </header>
            <Container className='mb-4'>
                <Row className='gap-2 app-controls'>
                    <Col xs='auto'>
                        <Button onClick={() => openForm()} disabled={loading} variant='success' size='lg'>+ New Starship</Button>
                    </Col>
                    <Col xs='auto'>
                        <Button onClick={() => fetchStarships()} disabled={loading} variant='primary' size='lg'>
                            {loading ? <><Spinner animation='border' size='sm' className='me-2' />Loading...</> : 'Refresh'}
                        </Button>
                    </Col>
                    <Col xs='auto'>
                        <Button onClick={() => handleSWAPISync()} disabled={syncing || loading} variant='info' size='lg'>
                            {syncing ? <><Spinner animation='border' size='sm' className='me-2' />Syncing...</> : 'Refresh'}
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Container>
                {error && (<Alert variant='danger' onClose={() => setError(null)} dismissible>{error}</Alert>)}

                <main className='app-main'>
                    {loading ? (
                        <div className='text-center py-5'>
                            <Spinner animation='border' role='status' className='mb-3'><span className='visually-hidden'>Loading...</span></Spinner>
                            <p>Loading ships...</p>
                        </div>
                    ) : (
                        <StarshipTable starships={starships} loading={loading} onEdit={openForm} onDelete={handleDelete} deleteLoading={deleteLoading}></StarshipTable>
                    )}
                </main>
            </Container>

            {showForm && (<StarshipForm starship={editingStarship} onSubmit={formSubmit} onCancel={closeForm} isLoading={formLoading}></StarshipForm>)}

            <footer className='app-footer mt-5 py-4 bg-dark text-white text-center'>
                <Container>
                    <p className='mb-0'>Data sourced from SWAPI (Star Wars API) - A free, open-source API for Star Wars data.</p>
                </Container>
            </footer>
        </div>
    );
};

export default App;