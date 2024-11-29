import express from "express";
import joi from "joi";
import Character from "../schemas/character.schema.js";


const UserRouter = express.Router();

const createdCharacterSchema = joi.object({
    character_name: joi.string().min(1).max(50).required(),
    character_health: joi.number().min(0),
    character_damage: joi.number().min(0),
    character_date: joi.number().min(0)
});

// 할일 등록 API //
UserRouter.post("/characters", async (req, res, next) => {
  try {
    // 1. 클라이언트로 부터 받아온 value 데이터를 가져온다.

    const validation = await createdCharacterSchema.validateAsync(req.body);

    const { character_name, character_health, character_damage, character_date } = validation;

    // 1.1 만약, 클라이언트가 value 데이터를 잘못 전달 했을 때,
    // 클라이언트에게 메시지를 전달.
    // if (!item_name) {
    //   return res.status(400).json({
    //     errorMessage: "아이탬 이름이 잘못입력 되었습니다."
    //   });
    // }

    // 2. 해당하는 마지막 order 데이터를 조회한다.
    // sort = 정렬한다. -> 어떤 컬럼을?
    const characterMaxCharacterId = await Character.findOne().sort("-characterId").exec();

    // 3. 만약 존재한다면 현재 해야 할 일을 +1 하고,
    // order 데이터가 존재하지 않다면, 1로 할당한다.
    const characterId = characterMaxCharacterId.characterId ? characterMaxCharacterId.characterId + 1 : 1;

    // 4. 해야 할 일 등록
    const character = new Character({ characterId, character_name, character_health, character_damage, character_date });

    await character.save();

    // 5. 해야 할 일을 클라이언트에게 반환한다.
    return res.status(201).json({ character: character });
  } catch (error) {
    next(error);
  }
});

// 해야 할 일 목록 API //
UserRouter.get("/characters", async (req, res, next) => {
  // 1. 해야할 일 목록 조회를 진행한다.
  const characters = await Character.find().sort("characterId").exec();

  // 2. 해야할 일 목록 조회 결과를 클라이언트에게 반환한다.
  return res.status(200).json({ characters });
});

// 해야할 일 순서 변경, 완료 / 해제 API //
UserRouter.patch("/characters/:characterId", async (req, res, next) => {
  const { characterId } = req.params;
  const { characterId2, done, character_name, } = req.body;

  // 현재 나의 order 가 무엇인지 알아야 한다.
  const currentCharacter = await Character.findById(characterId2).exec();
  if (!currentCharacter) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야할 일 입니다." });
  }

  if (characterId) {
    const targetCharacter = await Character.findOne({ characterId }).exec();
    if (targetCharacter) {
        targetCharacter.characterId = targetCharacter.characterId;
      await targetCharacter.save();
    }
    currentCharacter.characterId = characterId;
  }
  if (done !== undefined) {
    currentCharacter.doneAt = done ? new Date() : null;
  }
  if (character_name) {
    currentCharacter.character_name = character_name;
  }

  await currentCharacter.save();

  return res.status(200).json({});
});

// 할 일 삭제 API //
UserRouter.delete("/characters/:characterId2", async (req, res, next) => {
  const { characterId2 } = req.params;

  const character = await Character.findById(characterId2).exec();
  if (!character) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야할 일 정보입니다." });
  }

  await Character.deleteOne({ _id: characterId2 });

  return res.status(200).json({});
});

// 할 일 내용 변경하기 API //

export default UserRouter;
