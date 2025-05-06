import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import './Clothes.css';

function Clothes() {
    const [clothes, setClothes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchClothes();
    }, []);

    const fetchClothes = () => {
        axios.get('http://localhost:5000/api/clothes')
            .then(res => setClothes(res.data))
            .catch(err => console.error(err));
    };

    const handleAddToCart = async (cloth) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/cart', {
                userId: user._id,
                clothesId: cloth._id // ✅ FIXED KEY
            });

            setSuccessMessage(`${cloth.name} added to cart successfully!`);
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error.response?.data || error);
            alert('Failed to add to cart');
        }
    };

    const handleEdit = (cloth) => {
        navigate(`/edit-clothes/${cloth._id}`);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/clothes/${deleteId}`);
            setClothes(clothes.filter(c => c._id !== deleteId));
            setSuccessMessage('✅ Clothing item deleted successfully!');
        } catch (err) {
            console.error('Delete failed:', err);
            setSuccessMessage('❌ Failed to delete clothing item');
        } finally {
            setShowModal(false);
            setTimeout(() => setSuccessMessage(''), 2000);
        }
    };

    const filteredClothes = clothes.filter(cloth =>
        cloth.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page clothes">
            <h2>Available Clothes 👕</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search clothes..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {successMessage && (
                <div className="success-toast">{successMessage}</div>
            )}

            <div className="cloth-list">
                {filteredClothes.length > 0 ? (
                    filteredClothes.map(cloth => (
                        <div key={cloth._id} className="cloth-card">
                            <img src={cloth.image} alt={cloth.name} className="cloth-image" />
                            <h3>{cloth.name}</h3>
                            <p className="price">₹{cloth.price}</p>
                            <p className="description">{cloth.description}</p>

                            <div className="cloth-actions">
                                <button onClick={() => handleAddToCart(cloth)}>Add to Cart</button>

                                {user && user.isAdmin && (
                                    <>
                                        <button onClick={() => handleEdit(cloth)}>Edit</button>
                                        <button onClick={() => confirmDelete(cloth._id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No clothes found 🧥</p>
                )}
            </div>

            <ConfirmationModal
                isOpen={showModal}
                title="Confirm Delete"
                message="Are you sure you want to delete this item?"
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
            />
        </div>
    );
}

export default Clothes;
