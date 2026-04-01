import { Response, Request } from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";

export const index = async (req: Request, res: Response) => {
  // Filter with status
  interface Find {
    deleted: boolean;
    status?: string;
  }

  const find: Find = {
    deleted: false,
  };

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
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey.toString()] = req.query.sortValue;
  }
  // End Sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
  const id: string = String(req.params.id);

  const tasks = await Task.find({
    _id: id,
    deleted: false,
  });

  res.json(tasks);
};
