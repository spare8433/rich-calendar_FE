import { CheckedState } from "@radix-ui/react-checkbox";
import { ChevronLeft, CirclePlus, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/app/components/ui/button";
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
import { useCalendarContext } from "@/contexts/calendar";
import { useToast } from "@/hooks/use-toast";

import { ScheduleFormValues } from "../form-schema";

export default function TagsField() {
  const { toast } = useToast();
  const { entireTags, addTag, updateTag, deleteTag } = useCalendarContext();
  const { watch, setValue } = useFormContext<ScheduleFormValues>();
  const { tags } = watch();
  const [mode, setMode] = useState<"add" | "list" | "modify">("list");
  const [tagTitle, setTagTitle] = useState("");
  const [tagId, setTagId] = useState<string | null>(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  // 현재 체크된 tag id 목록 state 초기값은 form 의 초기 tag id 목록
  const [checkedTagIds, setCheckedTagsIds] = useState<string[]>(tags.map(({ id }) => id));

  const handleCheckedChange = (checked: CheckedState, tagId: string) => {
    const currentTagsSet = new Set(checkedTagIds);
    checked ? currentTagsSet.add(tagId) : currentTagsSet.delete(tagId);
    setCheckedTagsIds(Array.from(currentTagsSet));

    // 체크된 tag id 기반으로 form value 변경
    setValue(
      "tags",
      entireTags.filter((tag) => currentTagsSet.has(tag.id)),
    );
  };

  const handleUpdateTag = () => {
    if (!tagId) {
      setMode("list");
      return toast({
        title: "태그 수정이 정상적으로 처리되지 않았습니다 잠시 후 다시 시도해 주세요.",
        variant: "warning",
      });
    }
    updateTag(tagId, tagTitle);
    setMode("list");
    setTagTitle("");
    setTagId(null);
  };

  const getCheckBoxChecked = (tagId: string) => new Set(checkedTagIds).has(tagId);

  return (
    <div className="space-y-3">
      {isSubMenuOpen ? "true" : "false"}
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
            {mode === "list" && (
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
                  {entireTags.map((tag) => (
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

                          <DropdownMenuItem className="gap-3" onSelect={() => deleteTag(tag.id)}>
                            <Trash2 />
                            태그 삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </>
            )}

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
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      addTag(tagTitle);
                      setMode("list");
                      setTagTitle("");
                    }}
                  >
                    등록
                  </Button>
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
                  <Button type="button" size="sm" onClick={handleUpdateTag}>
                    수정
                  </Button>
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
