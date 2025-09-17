import Property from "../models/property.model.js";

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
      const sortBy = req.query.sort.split(',').join('');
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
      staus: 'success',
      result: properties.length,
      data: { properties }
    });


  } catch (e) {


    res.status(500).json({
      message: 'server Error', error
    })


  }



}


export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('lister', 'name', 'phoneNumber');
    if (!property) {
      return res.status(404).json({
        message: 'property not found'
      })
    }

    res.status(200).json({ property });

  } catch (e) {
    res.status(500).json({
      message: 'server Error', error
    })

  }
}



