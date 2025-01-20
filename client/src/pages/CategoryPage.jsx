import React, { useState, useEffect } from 'react';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    // Fetch categories from API
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const createCategory = async () => {
        if (!newCategory.name || !newCategory.description) {
            alert('Both name and description are required');
            return;
        }

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
            });
            const data = await response.json();
            alert(data.message);
            setNewCategory({ name: '', description: '' }); // Reset form
            fetchCategories(); // Reload categories
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const deleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await fetch(`/api/categories/${categoryId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                alert(data.message);
                fetchCategories(); // Reload categories
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div>
            <h1>Category Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <textarea
                    placeholder="Category Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
                <button onClick={createCategory}>Create Category</button>
            </div>

            <h2>Category List</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {category.name} - {category.description}
                        <button onClick={() => deleteCategory(category.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryPage;
