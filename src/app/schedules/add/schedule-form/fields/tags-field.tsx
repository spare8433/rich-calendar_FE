import { CheckedState } from "@radix-ui/react-checkbox";
import { DefaultError, useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, CirclePlus, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import BasicLoader from "@/app/components/basic-loader";
import { Button, LoadingButton } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Separator } from "@/app/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/lib/api";
import { handleMutationError } from "@/lib/utils";

import { ScheduleFormValues } from "../form-schema";

interface CreateTagVariables {
  req: CreateScheduleTagReq;
}

interface UpdateTagVariables {
  req: UpdateScheduleTagReq;
  pathParam: string;
}

interface DeleteTagVariables {
  pathParam: string;
}

export default function TagsField() {
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ["scheduleTags"],
    queryFn: () => apiRequest("getScheduleTags"),
  });

  const { toast } = useToast();
  const { watch, setValue } = useFormContext<ScheduleFormValues>();
  const { tags } = watch();

  const [mode, setMode] = useState<"list" | "add" | "modify">("list");
  const [tagTitle, setTagTitle] = useState("");
  const [tagId, setTagId] = useState<number | null>(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  // 현재 체크된 tag id 목록 state 초기값은 form 의 초기 tag id 목록
  const [checkedTagIds, setCheckedTagsIds] = useState<number[]>(tags.map(({ id }) => id));

  const { mutate: createTagMutate, isPending: isCreateLoading } = useMutation<null, DefaultError, CreateTagVariables>({
    mutationFn: ({ req }) => apiRequest("createScheduleTag", req, ""),
    onSuccess: () => {
      setMode("list");
      setTagTitle("");
      refetch();
    },
    onError: (error) =>
      handleMutationError(error, {
        400: () => toast({ title: "태그 생성에 실패했습니다 입력하신 정보를 다시 확인해주세요.", variant: "warning" }),
        409: () => {
          toast({ title: "중복된 태그를 생성할 수 없습니다.", variant: "warning" });
          setTagTitle("");
        },
        default: () =>
          toast({
            title: "태그 생성이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const { mutate: updateTagMutate, isPending: isUpdateLoading } = useMutation<null, DefaultError, UpdateTagVariables>({
    mutationFn: ({ req, pathParam }) => apiRequest("updateScheduleTag", req, pathParam),
    onSuccess: () => {
      setMode("list");
      setTagTitle("");
      setTagId(null);
      refetch();
    },
    onError: (error) =>
      handleMutationError(error, {
        400: () => toast({ title: "태그 수정에 실패했습니다 입력하신 정보를 다시 확인해주세요.", variant: "warning" }),
        404: () => toast({ title: "태그 수정에 실패했습니다 입력하신 정보를 다시 확인해주세요.", variant: "warning" }),
        default: () =>
          toast({
            title: "태그 수정이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const { mutate: deleteTagMutate, isPending: isDeleteLoading } = useMutation<null, DefaultError, DeleteTagVariables>({
    mutationFn: ({ pathParam }) => apiRequest("deleteScheduleTag", undefined, pathParam),
    onSuccess: () => refetch(),
    onError: (error) =>
      handleMutationError(error, {
        400: () => {
          toast({ title: "해당 태그를 확인 할 수 없습니다.", variant: "warning" });
          refetch();
        },
        404: () => {
          toast({ title: "해당 태그를 확인 할 수 없습니다.", variant: "warning" });
          refetch();
        },
        default: () =>
          toast({
            title: "태그 삭제가 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          }),
      }),
  });

  const handleUpdateTag = () => {
    if (!tagId) {
      setMode("list");
      refetch();
      return toast({
        title: "태그 수정이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
        variant: "warning",
      });
    }
    updateTagMutate({ req: { title: tagTitle }, pathParam: tagId.toString() });
  };

  const handleCheckedChange = (checked: CheckedState, tagId: number) => {
    if (!data) return;

    const currentTagsSet = new Set(checkedTagIds);
    checked ? currentTagsSet.add(tagId) : currentTagsSet.delete(tagId);
    setCheckedTagsIds(Array.from(currentTagsSet));

    // 체크된 tag id 기반으로 form value 변경
    setValue(
      "tags",
      data.tags.filter((tag) => currentTagsSet.has(tag.id)),
    );
  };

  const getCheckBoxChecked = (tagId: number) => new Set(checkedTagIds).has(tagId);

  return (
    <div className="space-y-3">
      <div className="mb-3 flex items-center gap-x-4">
        <span className="text-sm font-medium">분류</span>

        {/* tag 수정 popover */}
        <Popover onOpenChange={(open) => open && setMode("list")}>
          <PopoverTrigger asChild>
            <Button type="button" variant="default" size="sm">
              태그 변경
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="space-y-3"
            side="right"
            onInteractOutside={(e) => isSubMenuOpen && mode === "list" && e.preventDefault()}
          >
            {/* popover tag 목록 content box */}
            {mode === "list" &&
              (isSuccess ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium">분류 수정</h2>
                    {/* tag 추가 버튼 */}
                    <Button
                      variant={null}
                      size={null}
                      onClick={() => {
                        setTagTitle("");
                        setMode("add");
                      }}
                    >
                      <CirclePlus />
                    </Button>
                  </div>

                  <Separator />

                  {/* popover tag 체크박스 목록 */}
                  <div className="space-y-3">
                    {data.tags.map((tag) => (
                      <div key={tag.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 py-0.5">
                          <Checkbox
                            id={`${tag.id}-${tag.title}`}
                            defaultChecked={getCheckBoxChecked(tag.id)}
                            onCheckedChange={(checked) => handleCheckedChange(checked, tag.id)}
                          />
                          <Label className="cursor-pointer" htmlFor={`${tag.id}-${tag.title}`}>
                            {tag.title}
                          </Label>
                        </div>

                        {/* tag 서브 메뉴 */}
                        <DropdownMenu onOpenChange={(open) => setIsSubMenuOpen(open)}>
                          <DropdownMenuTrigger>
                            <Ellipsis size={16} />
                          </DropdownMenuTrigger>

                          {/* tag 서브 메뉴 목록 */}
                          <DropdownMenuContent side="right">
                            <DropdownMenuItem
                              className="gap-3"
                              onSelect={() => {
                                setMode("modify");
                                setTagTitle(tag.title);
                                setTagId(tag.id);
                              }}
                            >
                              <Pencil />
                              태그 수정
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="gap-3"
                              onSelect={() => deleteTagMutate({ pathParam: tag.id.toString() })}
                            >
                              <Trash2 />
                              태그 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <BasicLoader />
              ))}

            {/* popover tag 추가 content box */}
            {mode === "add" && (
              <>
                <div className="flex items-center gap-2">
                  {/* 이전 버튼(list 화면으로) */}
                  <Button
                    type="button"
                    variant={null}
                    size={null}
                    onClick={() => {
                      setMode("list");
                      setIsSubMenuOpen(false);
                    }}
                  >
                    <ChevronLeft />
                  </Button>
                  <h2 className="text-sm font-medium">태그 등록</h2>
                </div>

                <Separator />

                {/* 태그 등록 inputs */}
                <div className="flex items-center gap-x-2">
                  <Input
                    placeholder="등록할 태그명"
                    value={tagTitle}
                    onChange={(e) => setTagTitle(e.currentTarget.value)}
                  />
                  <LoadingButton
                    type="button"
                    size="sm"
                    isLoading={isCreateLoading}
                    onClick={() => createTagMutate({ req: { title: tagTitle } })}
                  >
                    등록
                  </LoadingButton>
                </div>
              </>
            )}

            {/* popover tag 수정 content box */}
            {mode === "modify" && (
              <>
                <div className="flex items-center gap-2">
                  {/* 이전 버튼(list 화면으로) */}
                  <Button
                    type="button"
                    variant={null}
                    size={null}
                    onClick={() => {
                      setMode("list");
                      setIsSubMenuOpen(false);
                    }}
                  >
                    <ChevronLeft />
                  </Button>
                  <h2 className="text-sm font-medium">태그 수정</h2>
                </div>

                <Separator />

                {/* 태그 수정 inputs */}
                <div className="flex items-center gap-x-2">
                  <Input
                    placeholder="수정할 태그명"
                    value={tagTitle}
                    onChange={(e) => setTagTitle(e.currentTarget.value)}
                  />
                  <LoadingButton type="button" size="sm" isLoading={isUpdateLoading} onClick={handleUpdateTag}>
                    수정
                  </LoadingButton>
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        {/* 실제 활성화된 tag 목록 */}
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <div key={tag.id} className="border-muted-foreground rounded-full border px-3 py-1.5 text-sm font-medium">
              {tag.title}
            </div>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">지정된 태그가 존재하지 않습니다.</span>
        )}
      </div>
    </div>
  );
}
