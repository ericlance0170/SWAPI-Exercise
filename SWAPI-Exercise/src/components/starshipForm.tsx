import React, {useState, useEffect} from 'react';
import {Modal, Button, Form, Alert, Spinner, Row, Col} from 'react-bootstrap';
import {Starship} from '../services/apiService';
import '../styles/starshipForm.css';

interface StarshipFormProperties{
    starship?: Starship;
    onSubmit: (starship: Starship) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const StarshipForm: React.FC<StarshipFormProperties> = ({starship, onSubmit, onCancel, isLoading = false}) => {
    const [formData, setFormData] = useState<Starship>({
        id: starship?.id || 0,
        name: '',
        model: '',
        manufacturer: '',
        costInCredits: '',
        length: '',
        maxAtmospheringSpeed: '',
        crew: '',
        passengers: '',
        cargoCapacity: '',
        consumables: '',
        hyperdriveRating: '',
        mglt: '',
        starshipClass: '',
        pilots: [],
        films: [],
        ...starship, 
    });

    const [pilotsInput, setPilotsInput] = useState(formData.pilots.join(', '));
    const [filmsInput, setFilmsInput] = useState(formData.films.join(', '));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(starship){
            setFormData(starship);
            setPilotsInput(starship.pilots?.join(', ') || '');
            setFilmsInput(starship.films?.join(', ') || '');
        }
    }, [starship]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const {name, value} = e.target;
        setFormData((prev:Starship) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if(!formData.name?.trim()){
            setError('Starship name is required');
            return;
        }
        if(!formData.model?.trim()){
            setError('Model is required');
            return;
        }
        if(!formData.manufacturer?.trim()){
            setError('Manufacturer is required');
            return;
        }

        try{
            const submitData = {
                ...formData,
                pilots: pilotsInput.split(',').map((m: string) => m.trim()).filter((m: string) => m.length > 0),
                films: filmsInput.split(',').map((m: string) => m.trim()).filter((m: string) => m.length > 0),
            };
            await onSubmit(submitData);
        }
        catch(e){
            setError('Error, unable to save starship. Please try again.');
            console.error(e);
        }
    };

    return(
        <Modal show={true} onHide={onCancel} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{starship?.id ? 'Edit Starship' : "Create New Starship"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Name *</Form.Label>
                                <Form.Control type="text" name='name' value={formData.name} onChange={handleInputChange} placeholder='e.g., Millennium Falcon' required></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Model *</Form.Label>
                                <Form.Control type="text" name='model' value={formData.model} onChange={handleInputChange} placeholder='e.g., YT-1300 light freighter' required></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Manufacturer *</Form.Label>
                                <Form.Control type="text" name='manufacturer' value={formData.manufacturer} onChange={handleInputChange} placeholder='e.g., Corellian Engineering' required></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Starship Class</Form.Label>
                                <Form.Control type="text" name='starshipClass' value={formData.starshipClass} onChange={handleInputChange} placeholder='e.g., Light Freighter'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Length</Form.Label>
                                <Form.Control type="text" name='length' value={formData.length} onChange={handleInputChange} placeholder='e.g., 34.37'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Crew</Form.Label>
                                <Form.Control type="text" name='crew' value={formData.crew} onChange={handleInputChange} placeholder='e.g., 4'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Passengers</Form.Label>
                                <Form.Control type="text" name='passengers' value={formData.passengers} onChange={handleInputChange} placeholder='e.g., 6'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Cost In Credits</Form.Label>
                                <Form.Control type="text" name='costInCredits' value={formData.costInCredits} onChange={handleInputChange} placeholder='e.g., 100000'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Cargo Capacity</Form.Label>
                                <Form.Control type="text" name='cargoCapacity' value={formData.cargoCapacity} onChange={handleInputChange} placeholder='e.g., 100000'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Max Atmosphering Speed</Form.Label>
                                <Form.Control type="text" name='maxAtmospheringSpeed' value={formData.maxAtmospheringSpeed} onChange={handleInputChange} placeholder='e.g., 1050'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Consumables</Form.Label>
                                <Form.Control type="text" name='consumables' value={formData.consumables} onChange={handleInputChange} placeholder='e.g., 2 months'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Hyperdrive Rating</Form.Label>
                                <Form.Control type="text" name='hyperdriveRating' value={formData.hyperdriveRating} onChange={handleInputChange} placeholder='e.g., 0.5'></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>MGLT</Form.Label>
                                <Form.Control type="text" name='mglt' value={formData.mglt} onChange={handleInputChange} placeholder='e.g., 75'></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Col md={3}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Pilots (comma-separated)</Form.Label>
                            <Form.Control as="textarea" name='pilots' value={pilotsInput} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPilotsInput(e.target.value)} placeholder="e.g., Han Solo, Chewbacca" rows={2}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Films (comma-separated)</Form.Label>
                            <Form.Control as="textarea" name='films' value={filmsInput} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFilmsInput(e.target.value)} placeholder="e.g., A New Hope, The Empire Strikes Back" rows={2}></Form.Control>
                        </Form.Group>
                    </Col>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>{isLoading ? (<><Spinner animation='border' size='sm' className='me-2' ></Spinner>Saving...</>) : (starship?.id ? 'Update' : 'Create')}</Button>
            </Modal.Footer>
        </Modal>
    );
};