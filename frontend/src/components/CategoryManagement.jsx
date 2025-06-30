import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { CategoryService } from '../services';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      const data = await CategoryService.getAllCategories();
      setCategories(data || []);
      
      // Show info message if no data found
      if (!data || data.length === 0) {
        toast('No categories found. Start by adding your first category!', {
          icon: 'ℹ️',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
      if (error.message.includes('Access denied') || error.response?.status === 403) {
        setAccessDenied(true);
        toast.error(error.message);
      } else if (error.message.includes('Network error')) {
        toast.error('Network error. Please check your internet connection.');
      } else if (error.message.includes('Server error')) {
        toast.error('Server is temporarily unavailable. Please try again later.');
      } else {
        toast.error(error.message || 'Unable to load categories');
      }
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditingCategory(null);
    reset();
  };

  const handleShow = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setValue('categoryName', category.categoryName);
    }
    setShow(true);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Validate data before sending
      if (!data.categoryName || data.categoryName.trim() === '') {
        toast.error('Category name is required');
        return;
      }

      // Trim whitespace from category name
      const categoryData = {
        categoryName: data.categoryName.trim()
      };

      console.log('Submitting category data:', categoryData);

      if (editingCategory) {
        await CategoryService.updateCategory(editingCategory.categoryId, categoryData);
        toast.success('Category updated successfully!');
      } else {
        await CategoryService.createCategory(categoryData);
        toast.success('Category created successfully!');
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      try {
        await CategoryService.deleteCategory(id);
        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="light" size="lg" />
          <p className="text-white mt-3">Loading categories...</p>
        </Container>
      </div>
    );
  }

  // if (accessDenied) {
  //   return (
  //     <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
  //       <Container className="py-5 text-center">
  //         <Alert variant="danger" className="mx-auto" style={{ maxWidth: '500px' }}>
  //           <Alert.Heading>
  //             <i className="bi bi-shield-exclamation display-4 d-block mb-3"></i>
  //             Access Denied
  //           </Alert.Heading>
  //           <p>You don't have permission to access category management.</p>
  //           <p>Please login with proper credentials to continue.</p>
  //           <hr />
  //           <div className="d-flex gap-2 justify-content-center">
  //             <Button variant="primary" onClick={() => window.location.href = '/login'}>
  //               Go to Login
  //             </Button>
  //             <Button variant="outline-secondary" onClick={() => window.location.reload()}>
  //               Try Again
  //             </Button>
  //           </div>
  //         </Alert>
  //       </Container>
  //     </div>
  //   );
  // }

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        <Toaster position="top-right" />
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold mb-3">
            📂 Category Management
          </h1>
          <p className="lead text-white-50 mb-4">
            Manage orchid categories
          </p>
          <Button 
            variant="light" 
            size="lg"
            onClick={() => handleShow()}
            className="px-4 py-2 rounded-pill shadow-lg"
            style={{ 
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              border: 'none',
              color: 'white'
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add New Category
          </Button>
        </div>

        {/* Categories Table */}
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body className="p-0">
            {categories.length === 0 ? (
              <Alert variant="info" className="text-center py-5 m-4 rounded-4">
                <i className="bi bi-folder2-open display-1 d-block mb-3"></i>
                <h4>No categories found</h4>
                <p>Start by adding your first category!</p>
              </Alert>
            ) : (
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3">ID</th>
                    <th className="border-0 px-4 py-3">Category Name</th>
                    <th className="border-0 px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id}>
                      <td className="px-4 py-3">
                        <Badge bg="primary" className="rounded-pill">
                          {index + 1}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 fw-semibold">
                        {category.categoryName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2 rounded-pill"
                          onClick={() => handleShow(category)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleDelete(category.categoryId, category.categoryName)}
                        >
                          <i className="bi bi-trash3"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title>
              <i className="bi bi-folder-plus me-2"></i>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name..."
                  className="rounded-pill"
                  {...register("categoryName", { required: "Category name is required" })}
                />
                {errors.categoryName && (
                  <div className="text-danger small mt-1">{errors.categoryName.message}</div>
                )}
              </Form.Group>



              <div className="text-end">
                <Button variant="outline-secondary" onClick={handleClose} className="me-2 rounded-pill">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-pill"
                  style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    border: 'none'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {editingCategory ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
