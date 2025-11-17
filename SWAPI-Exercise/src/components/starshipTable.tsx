import React, {useState, useEffect, useMemo} from 'react';
import {Table, Form, Badge, Button, Spinner} from 'react-bootstrap';
import {Starship} from '../services/apiService';
import '../styles/starshipTable.css';

type SortKey = keyof Starship;
type SortOrder = 'asc' | 'desc';

interface StarshipTableProperties{
    starships: Starship[];
    loading: boolean;
    onEdit: (starship: Starship) => void;
    onDelete: (id: number) => Promise<void>;
    deleteLoading?: number | null;
}

export const StarshipTable: React.FC<StarshipTableProperties> = ({starships, loading, onEdit, onDelete, deleteLoading}) =>{
    const [SortKey, setSortKey] = useState<SortKey>('name');
    const [SortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterText, setFilterText] = useState('');
    const [filteredStarships, setFilteredStarships] = useState<Starship[]>(starships);

    useEffect(() => {
        const filtered = starships.filter((ship: Starship) =>
            ship.name.toLowerCase().includes(filterText.toLowerCase()) || ship.model.toLowerCase().includes(filterText.toLowerCase()) ||
            ship.manufacturer.toLowerCase().includes(filterText.toLowerCase()) || ship.starshipClass.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredStarships(filtered);
    }, [filterText, starships]);

    const sorted = useMemo(() => {
        const arr = [...filteredStarships];
        arr.sort((a,b) => {
            const aValue = a[SortKey];
            const bValue = a[SortKey];

            if(typeof aValue === 'string' && typeof bValue === 'string'){
                return SortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if(typeof aValue === 'number' && typeof bValue === 'number'){
                return SortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
        return arr;
    }, [filteredStarships, SortKey, SortOrder]); 
    const handleSort = (key: SortKey) => {
        if(SortKey === key){
            setSortOrder(SortOrder === 'asc' ? 'desc' : 'asc');
        }
        else{
            setSortKey(key);
            setSortOrder('asc');
        }
    };
    const handleDelete = async(id: number, name: string) => {
        if(window.confirm(`I have a bad feeling about this...\nAre you sure you want to delete "${name}"?`)){
            await onDelete(id);
        }
    };
    const renderSortIcon = (key: SortKey) => {
        if(SortKey !== key){
            return ' ⇅ ';
        }
        return SortOrder === 'asc' ? ' ↑ ' : ' ↓ '
    };

    if(loading){
        return <div className="loading">Loading ships...</div>;
    }

    return(
        <div className="starships-table-container">
            <div className='filter-controls mb-3'>
                <Form.Group>
                    <Form.Control type='text' placeholder='Filter by name, model, manufacturer, or class' value={filterText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)} size="lg"></Form.Control>
                </Form.Group>
                <p className='result-count mt-2'>
                    <Badge bg='info'>{sorted.length}</Badge> result(s)
                </p>
            </div>
            <div className='table-wrapper'>
                {sorted.length === 0 ? (<div className='alert alert-info'>No starships found matching your filter.</div>) :
                (
                    <Table striped bordered hover responsive className='starships-table'>
                        <thead className='table-dark'>
                            <tr>
                                <th onClick={() => handleSort('name')} className='sortable' style={{cursor: 'pointer'}}>Name{renderSortIcon('name')}</th>
                                <th onClick={() => handleSort('model')} className='sortable' style={{cursor: 'pointer'}}>Model{renderSortIcon('model')}</th>
                                <th onClick={() => handleSort('manufacturer')} className='sortable' style={{cursor: 'pointer'}}>Manufacturer{renderSortIcon('manufacturer')}</th>
                                <th onClick={() => handleSort('starshipClass')} className='sortable' style={{cursor: 'pointer'}}>Starship Class{renderSortIcon('starshipClass')}</th>
                                <th onClick={() => handleSort('crew')} className='sortable' style={{cursor: 'pointer'}}>Crew{renderSortIcon('crew')}</th>
                                <th onClick={() => handleSort('passengers')} className='sortable' style={{cursor: 'pointer'}}>Passengers{renderSortIcon('passengers')}</th>
                                <th onClick={() => handleSort('length')} className='sortable' style={{cursor: 'pointer'}}>Length{renderSortIcon('length')}</th>
                                <th onClick={() => handleSort('maxAtmospheringSpeed')} className='sortable' style={{cursor: 'pointer'}}>Max Atmosphering Speed{renderSortIcon('maxAtmospheringSpeed')}</th>
                                <th onClick={() => handleSort('costInCredits')} className='sortable' style={{cursor: 'pointer'}}>Cost in Credits{renderSortIcon('costInCredits')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((ship) => (
                                <tr key={ship.id} className='starship-row'>
                                    <td className='name-cell fw-bold'>{ship.name || 'N/A'}</td>
                                    <td>{ship.model || 'N/A'}</td>
                                    <td>{ship.manufacturer || 'N/A'}</td>
                                    <td><Badge bg='secondary'>{ship.starshipClass || 'N/A'}</Badge></td>
                                    <td>{ship.crew || 'N/A'}</td>
                                    <td>{ship.passengers || 'N/A'}</td>
                                    <td>{ship.length || 'N/A'}</td>
                                    <td>{ship.maxAtmospheringSpeed || 'N/A'}</td>
                                    <td>{ship.costInCredits || 'N/A'}</td>
                                    <td className='actions-cell'>
                                        <Button onClick={() => onEdit(ship)} variant='warning' size='sm' className='me-2' title='Edit Starship'>✎ Edit</Button>
                                        <Button onClick={() => handleDelete(ship.id, ship.name)} variant='danger' size='sm' disabled={deleteLoading === ship.id} title='Delete Starship'>{deleteLoading === ship.id ? (<><Spinner animation='border' size='sm' className='me-1'></Spinner>Deleting</>) : (<>X Delete</>)}</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
    );
}