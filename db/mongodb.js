import { connect } from "mongoose";

const connectMongoDB = (url) => {
  return connect(url);
};

export default connectMongoDB;
