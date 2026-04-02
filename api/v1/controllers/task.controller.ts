import { Response, Request } from "express";

import Task from "../models/task.model";

import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response) => {
  // Filter with status
  interface Find {
    deleted: boolean;
    status?: string;
    title?: RegExp;
  }

  const find: Find = {
    deleted: false,
  };

  // Search
  let objectSearch = searchHelper(req.query);

  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  // End Search

  if (req.query.status) {
    find["status"] = req.query.status.toString();
  }
  // End Filter with status

  // Pagination
  let paginationInit = {
    currentPage: 1,
    limitItems: 2,
  };
  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(
    paginationInit,
    req.query,
    countTasks,
  );
  // End Pagination

  // Sort
  const sort: Record<string, any> = {};

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  }
  // End Sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip || 0);

  res.json({
    code: 200,
    tasks: tasks,
  });
};

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = String(req.params.id);

  const tasks = await Task.find({
    _id: id,
    deleted: false,
  });

  res.json(tasks);
};

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id.toString();
    const status: string = req.body.status;

    await Task.updateOne({ _id: id }, { status: status });

    res.json({
      code: 200,
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  enum Key {
    STATUS = "status",
    DELETE = "delete",
  }

  const ids: string[] = req.body.ids;
  const key: string = req.body.key;
  const value: string = req.body.value;

  switch (key) {
    case Key.STATUS:
      await Task.updateMany({ _id: { $in: ids } }, { status: value });
      res.json({
        code: 200,
      });
      break;
    case Key.DELETE:
      await Task.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() },
      );
      res.json({
        code: 200,
        message: "Update successfully!",
      });
      break;
    default:
      res.json({
        code: 400,
      });
      break;
  }
};

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id.toString();
    const status: string = req.body.status;

    await Task.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [DELETE] /api/v1/tasks/delete
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id: string = String(req.params.id);

    await Task.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.json({
      code: 200,
      message: "Delete success!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Error!",
    });
  }
};
