import Property from "../models/property.model.js";




// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Admin/Agent)
export const createProperty = async (req, res) => {
  try {
    // Get property details from the request body
    const { title, description, propertyType, location, city, price, bedrooms, bathrooms, areaSqFt, imageUrls } = req.body;

    const property = await Property.create({
      title,
      description,
      propertyType,
      location,
      city,
      price,
      bedrooms,
      bathrooms,
      areaSqFt,
      imageUrls,
      lister: req.user.id, // The ID of the logged-in agent from the 'protect' middleware
    });

    res.status(201).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Admin/Agent)
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // You can add a check here to ensure only the lister or a super-admin can update
    // if(property.lister.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return res.status(403).json({ message: 'User not authorized to update this property' });
    // }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true // Run schema validators on update
    });

    res.status(200).json({
      status: 'success',
      data: { property }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Admin/Agent)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.deleteOne(); // Mongoose V6+

    res.status(200).json({
      status: 'success',
      message: 'Property removed successfully'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};




//geting all property

export const getAllProperty = async () => {

  try {
    //first filter the things

    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit'];

    excludedFields.forEach(el => delete queryObj[el]);

    //filter with prise 
    //
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Property.find(JSON.parse(queryStr))

    // sorting 
    //
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);

    } else {
      query = query.sort('-createdAt');//new property by default lega


    }
    // fast page moving
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const properties = await query;


    // send responce
    res.status(200).json({
      stauts: 'success',
      results: properties.length,
      data: { properties }
    });


  } catch (e) {


    res.status(500).json({
      message: 'server Error',
      error: e.message
    })


  }



}


export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('lister', 'name', 'phoneNumber', 'email');
    if (!property) {
      return res.status(404).json({
        message: 'property not found'
      })
    }

    res.status(200).json({ property });

  } catch (e) {
    res.status(500).json({
      message: 'server Error',
      error: e.message
    })

  }
}



