import express from "express";
import joi from "joi";
import Item from "../schemas/item.schema.js";


const router = express.Router();

const createdItemSchema = joi.object({
  item_name: joi.string().min(1).max(50).required(),
  item_health: joi.number().min(0),
  item_power: joi.number().min(0),
  item_defensive: joi.number().min(0),
  item_price: joi.number().min(0).required()
});

// 할일 등록 API //
router.post("/items", async (req, res, next) => {
  try {
    // 1. 클라이언트로 부터 받아온 value 데이터를 가져온다.

    const validation = await createdItemSchema.validateAsync(req.body);

    const { item_name, item_health, item_power, item_defensive, item_price } = validation;

    // 1.1 만약, 클라이언트가 value 데이터를 잘못 전달 했을 때,
    // 클라이언트에게 메시지를 전달.
    // if (!item_name) {
    //   return res.status(400).json({
    //     errorMessage: "아이탬 이름이 잘못입력 되었습니다."
    //   });
    // }

    // 2. 해당하는 마지막 order 데이터를 조회한다.
    // sort = 정렬한다. -> 어떤 컬럼을?
    const itemMaxCode = await Item.findOne().sort("-code").exec();

    // 3. 만약 존재한다면 현재 해야 할 일을 +1 하고,
    // order 데이터가 존재하지 않다면, 1로 할당한다.
    const code = itemMaxCode.code ? itemMaxCode.code + 1 : 1;

    // 4. 해야 할 일 등록
    const item = new Item({ code, item_name, item_health, item_power, item_defensive, item_price });

    await item.save();

    // 5. 해야 할 일을 클라이언트에게 반환한다.
    return res.status(201).json({ item: item });
  } catch (error) {
    next(error);
  }
});

// 해야 할 일 목록 API //
router.get("/items", async (req, res, next) => {
  // 1. 해야할 일 목록 조회를 진행한다.
  const items = await Item.find().sort("code").exec();

  // 2. 해야할 일 목록 조회 결과를 클라이언트에게 반환한다.
  return res.status(200).json({ items });
});

// 해야할 일 순서 변경, 완료 / 해제 API //
router.patch("/items/:itemId", async (req, res, next) => {
  const { itemId } = req.params;
  const { code, item_name, } = req.body;

  // 현재 나의 order 가 무엇인지 알아야 한다.
  const currentItem = await Item.findById(itemId).exec();
  if (!currentItem) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야할 일 입니다." });
  }

  if (code) {
    const targetItem = await Item.findOne({ code }).exec();
    if (targetItem) {
      targetItem.code = currentItem.code;
      await targetItem.save();
    }
    currentItem.code = code;
  }
 
  if (item_name) {
    currentItem.item_name = item_name;
  }
  await currentItem.save();

  return res.status(200).json({});
});

// 할 일 삭제 API //
router.delete("/items/:itemId", async (req, res, next) => {
  const { itemId } = req.params;

  const item = await Item.findById(itemId).exec();
  if (!item) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야할 일 정보입니다." });
  }

  await Item.deleteOne({ _id: itemId });

  return res.status(200).json({});
});

// 할 일 내용 변경하기 API //

export default router;

