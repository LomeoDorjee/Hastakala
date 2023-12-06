"use client"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  SortDescriptor,
  Tooltip,
  useDisclosure,
  Chip,
  Button
} from "@nextui-org/react";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { DeleteIcon, EditIcon, SearchIcon, ImageIcon } from "@/components/icons/icons";
import ProductForm from "../forms/ProductForm";
import Link from "next/link";

type ProductProps = {
  products: {
    productid: number
    productcode: string
    productname: string
    isactive: boolean
  }[]
}

type Product = {
  productid: number
  productcode: string
  productname: string
  isactive: boolean
}

const columns = [
  { name: "CODE", uid: "productcode", sortable: true },
  { name: "NAME", uid: "productname", sortable: true },
  { name: "ISACTIVE?", uid: "isactive", sortable: false },
  { name: "ACTIONS", uid: "actions" },
];


export default function ProductTable({ products }: ProductProps) {

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure()

  const [isSelected, setIsSelected] = useState(false)
  const [ToEditProductId, setToEditProductId] = useState(0);
  const [ToEditProductCode, setToEditProductCode] = useState("");
  const [ToEditProductName, setToEditProductName] = useState("");

  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const pages = Math.ceil(((products?.length) ? products.length : 1) / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredProducts = products;

    if (hasSearchFilter) {
      filteredProducts = filteredProducts?.filter((product) =>
        product.productname.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredProducts;
  }, [products, filterValue]);


  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Product, b: Product) => {
      const first = a[sortDescriptor.column as keyof Product] as unknown as number;
      const second = b[sortDescriptor.column as keyof Product] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return (sortedItems) ? sortedItems?.slice(start, end) : [];
  }, [page, sortedItems, rowsPerPage]);


  const handleEdit = (item: Product) => {
    setToEditProductName(item.productname)
    setToEditProductId(item.productid)
    setIsSelected(item.isactive)
    setToEditProductCode(item.productcode)
    onOpen()
  }

  const handleNew = () => {
    setToEditProductName("")
    setToEditProductId(0)
    setToEditProductCode("")
    setIsSelected(true)
    onOpen()
  }

  const renderCell = useCallback((product: Product, columnKey: Key) => {
    const cellValue = product[columnKey as keyof Product];

    switch (columnKey) {
      case "isactive":
        return (
          <Chip color={product.isactive ? "success" : "danger"} variant="flat"> {product.isactive ? "Active" : "Inactive"}</Chip>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-3">
            <Tooltip content="View Images" color="primary">
              <Link href={{
                pathname: `/config/product/upload/${product.productid}`
              }} color="primary">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <ImageIcon />
                </span>
              </Link>
            </Tooltip>
            <Tooltip content="Edit Product" color="secondary">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(product)}>
                <EditIcon />
              </span>
            </Tooltip>
            {/* <Tooltip color="danger" content="Delete Product">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip> */}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);


  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4 items-center w-full">
          <Input
            isClearable
            className="w-full"
            placeholder="Search by name..."
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
            size="sm"
          />
          <Button onPress={() => handleNew()} color="primary">&#10010; Add</Button>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    products?.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-default-400 text-small">Total {products?.length} Products</span>
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <ProductForm
        ToEditProductId={ToEditProductId}
        ToEditProductCode={ToEditProductCode}
        ToEditProductName={ToEditProductName}
        setToEditProductName={setToEditProductName}
        setToEditProductCode={setToEditProductCode}
        onOpen={onOpen}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        isSelected={isSelected}
        setIsSelected={setIsSelected}
      />
      <Table
        isCompact
        // removeWrapper
        aria-label="Product List"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        // classNames={classNames}
        selectionMode="single"
        color="primary"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No products found"} items={items}>
          {(item) => (
            <TableRow key={item.productid}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
