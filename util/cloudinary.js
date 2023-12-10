const cloudinary = require("cloudinary").v2;

const cloudinaryConfig = cloudinary.config({
  cloud_name: "dvlbv6l2k",
  api_key: "678197631371977",
  api_secret: "isgzZRDqnkzDrWGqzpSYv_TyfIA",
});

exports.destroyCloudinary = async (publicId) => {
  try {
    const res = await cloudinaryConfig.uploader.destroy(publicId);
    if (res.result === "ok") {
      console.log("Deleted image");
    }
  } catch (err) {
    console.error(err);
  }
};
