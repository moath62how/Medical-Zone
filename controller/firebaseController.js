const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDQ6JJ8d9pF1V9BSUKAwJPAArLAggirM8o",
  authDomain: "medical-zone-7a9eb.firebaseapp.com",
  projectId: "medical-zone-7a9eb",
  storageBucket: "medical-zone-7a9eb.appspot.com",
  messagingSenderId: "868226350415",
  appId: "1:868226350415:web:6c3abf09026aca493fd93a",
};

const firebase = initializeApp(firebaseConfig);

const storage = getStorage();

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

exports.uploadFirebase = async (req, res, next) => {
  try {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "-" + dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");
    req.imgData = {
      message: "file uploaded to firebase storage",
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    };
  } catch (error) {
    req.imgData = error.message;
  }
  next();
};
