

import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: false 
  },
  item_name: {
    type: String,
    required: true
  },
  item_health: {
    type: Number,
    required: false 
  },
  item_power: {
    type: Number,
    required: false 
  },
  item_defensive: {
    type: Number,
    required: false 
  },
  item_price: {
    type: Number,
    required: true 
  }
});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
ItemSchema.virtual("ItemId").get(function () {
  return this._id.toHexString();
});
ItemSchema.set("toJSON", {
  virtuals: true
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Item", ItemSchema);
