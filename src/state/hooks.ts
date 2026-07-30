// Always import these instead of plain useSelector / useDispatch
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../state";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
