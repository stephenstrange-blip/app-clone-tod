const { getManyMessage } = require("../db/database");

const FILTER = {
  SELECT: {
    id: true,
    content: true,
    authorId: true,
  },
  ORDER_BY: {
    updatedAt: "asc",
  },
  WHERE: {
    roomId: null,
  },
};

exports.fetchManyMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    FILTER.WHERE.roomId = Number(chatId);

    let messages = await getManyMessage({
      where: FILTER.WHERE,
      select: FILTER.SELECT,
      orderBy: FILTER.ORDER_BY,
    });

    messages = messages.map((message) => {
      if (message.authorId === req.user.id) message["myMessage"] = true;
      return message;
    });

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};
