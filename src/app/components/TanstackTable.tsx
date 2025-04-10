"use client";

import React from "react";

import "../globals.css";

import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	ColumnDef,
} from "@tanstack/react-table";
import { ItemData, TableProps } from "@/types";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useItemStore } from "../stores/itemStore";

export const LocationColumns: ColumnDef<ItemData>[] = [
	{
		accessorKey: "image",
		header: () => (
			<div className="flex items-center gap-2">
				<Image
					src="/imgs/frutigerPhoto.png"
					alt="Image icon"
					className="h-5 w-5"
					width={60}
					height={60}
				/>
				<span>Image</span>
			</div>
		),
		cell: ({ getValue }) => {
			const value = getValue() as string;
			return (
				<Image
					src={value}
					alt="Item visual"
					width={80}
					height={80}
					loading="lazy"
					quality={70}
				/>
			);
		},
		size: 150,
		minSize: 20,
		maxSize: 150,
		footer: (props) => props.column.id,
	},
	{
		accessorKey: "name",
		header: () => (
			<div className="flex items-center gap-2">
				<Image
					src="/imgs/butterfly.png"
					alt="Image icon"
					className="h-5 w-5"
					width={60}
					height={60}
				/>
				<span>Name</span>
			</div>
		),
		footer: (props) => props.column.id,
		size: 150,
		minSize: 20,
		maxSize: 150,
		cell: ({ getValue }) => (
			<div className="truncate max-w-[280px]" title={getValue() as string}>
				{getValue() as string}
			</div>
		),
	},
	{
		accessorKey: "location",
		header: () => (
			<div className="flex items-center gap-2">
				<Image
					src="/imgs/locationIcon.png"
					alt="Image icon"
					className="h-5 w-5"
					width={60}
					height={60}
				/>
				<span>Location</span>
			</div>
		),
		size: 150,
		minSize: 20,
		maxSize: 150,
		footer: (props) => props.column.id,
		cell: ({ getValue }) => (
			<div className="truncate max-w-[280px]" title={getValue() as string}>
				{getValue() as string}
			</div>
		),
	},
	{
		accessorKey: "current_status",
		header: () => (
			<div className="flex items-center gap-2">
				<Image
					src="/imgs/statusIcon.png"
					alt="Image icon"
					className="h-5 w-5"
					width={60}
					height={60}
				/>
				<span>Status</span>
			</div>
		),
		size: 150,
		minSize: 20,
		maxSize: 150,
		cell: ({ getValue }) => {
			const status = getValue() as string;
			let color = "";
			if (status === "Operational") color = "text-green-300";
			if (status === "Inactive") color = "text-red-400";
			if (status === "Redesigned") color = "text-yellow-300";
			return <span className={` ${color}`}>{status}</span>;
		},
		footer: (props) => props.column.id,
	},
];
const TanstackTable: React.FC<TableProps> = ({ dataItems, columns }) => {
	const router = useRouter();

	const navigateToItem = (item: ItemData) => {
		useItemStore.getState().setSelectedItem(item);
		router.push(`locations/${item._id.toString()}`);
	};

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const table = useReactTable({
		data: dataItems,
		columns,
		filterFns: {},
		state: {
			columnFilters,
		},
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: true,
		debugHeaders: true,
		debugColumns: false,
	});

	return (
		<>
			{" "}
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<th
										key={header.id}
										colSpan={header.colSpan}
										className={`px-4 py-3 text-left border-b-2 shaadow-lg border-gray-200/50 ${cn(header.column.columnDef.meta?.className)}`}
										style={{
											width: header.getSize(),
											minWidth: header.column.columnDef.minSize,
											maxWidth: header.column.columnDef.maxSize,
										}}>
										{header.isPlaceholder ? null : (
											<>
												<div
													{...{
														className: header.column.getCanSort()
															? "cursor-pointer select-none"
															: "",
														onClick: header.column.getToggleSortingHandler(),
													}}>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{{
														asc: " 🔼",
														desc: " 🔽",
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											</>
										)}
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => {
						return (
							<tr
								key={row.id}
								onClick={() => navigateToItem(row.original)}
								className=" hover:bg-gray-300/30 hover:cursor-[url(/imgs/magnifierCursor.png)]">
								{row.getVisibleCells().map((cell) => {
									return (
										<td
											key={cell.id}
											className={` px-4 py-3 ${cn(cell.column.columnDef.meta?.className)}`}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="flex items-center gap-2 pt-2 ">
				<button
					className="px-2 border  border-gray-200/50  shadow-xl hover:shadow-2xl transition-shadow shadow-teal-500/70 rounded-full cursor-pointer"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}>
					<ChevronsLeft className="stroke-white" />
				</button>
				<button
					className="px-2 border  border-gray-200/50   shadow-xl hover:shadow-2xl transition-shadow shadow-teal-500/70 rounded-full cursor-pointer"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					<ChevronLeft className="stroke-white" />
				</button>
				<button
					className=" px-2 border  border-gray-200/50   shadow-xl hover:shadow-2xl transition-shadow shadow-teal-500/70  rounded-full cursor-pointer"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					<ChevronRight className="stroke-white" />
				</button>
				<button
					className="px-2 border  border-gray-200/50 shadow-teal-500/70 hover:shadow-2xl transition-shadow  shadow-xl rounded-full cursor-pointer "
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}>
					<ChevronsRight className="stroke-white" />
				</button>
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</strong>
				</span>
				<span className="flex items-center gap-1">
					| Go to page:
					<input
						type="number"
						min="1"
						max={table.getPageCount()}
						defaultValue={table.getState().pagination.pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value ? Number(e.target.value) - 1 : 0;
							table.setPageIndex(page);
						}}
						className="border p-1 rounded w-16"
					/>
				</span>
				<select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value));
					}}>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
			</div>
		</>
	);
};
export default TanstackTable;
