const router = require('express').Router();
const { where } = require('sequelize');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product }]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }
    
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    console.log('Request Body:', req.body);

    const [updated] = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (updated === 0) {
      return res.status(404).json({ message: 'No Category found with this id!' });
    }
    
    const category = await Category.findByPk(req.params.id);

    res.status(200).json(category);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'An error occurred', error: err.message});
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const affectedRows = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!affectedRows) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
