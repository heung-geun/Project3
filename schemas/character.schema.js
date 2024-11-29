

import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
    characterId: {
    type: Number,
    required: false 
  },
  character_name: {
    type: String,
    required: true
  },
  character_health: {
    type: Number,
    required: false 
  },
  character_damage: {
    type: Number,
    required: false 
  },
  character_date: {
    type: Number,
    required: false 
  }
});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
characterSchema.virtual("characterId").get(function () {
  return this._id.toHexString();
});
characterSchema.set("toJSON", {
  virtuals: true
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("haracter", characterSchema);
