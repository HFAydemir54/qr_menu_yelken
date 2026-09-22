"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Localized, MenuCategory, MenuGroup, MenuItem } from "@/data/menu";
import {
  deleteAction,
  logoutAction,
  reorderAction,
  saveCategoryAction,
  saveGroupAction,
  saveItemAction,
  savePricesAction,
  toggleItemAvailableAction,
  type ActionState,
} from "./actions";
import { DragHandle, SortableList } from "./Sortable";
import { translateAction } from "./translate";

type Table = "categories" | "menu_groups" | "menu_items";

type Editor =
  | { kind: "category"; category?: MenuCategory }
  | { kind: "group"; categoryId: string; group?: MenuGroup }
  | { kind: "item"; groupId: string; item?: MenuItem };

const initial: ActionState = {};

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-base outline-none focus:border-brand-gold";
const iconButton =
  "grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-sm text-brand-muted hover:bg-black/5 disabled:opacity-40";

export function MenuAdmin({
  categories,
  priceDate,
}: {
  categories: MenuCategory[];
  priceDate: string;
}) {
  const [tab, setTab] = useState<"content" | "prices">("content");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [notice, setNotice] = useState<ActionState>({});
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  /** Silme, sıralama gibi formsuz işlemler. */
  const quick = (work: () => Promise<ActionState>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    startTransition(async () => {
      const result = await work();
      setNotice(result);
      // Başarısız işlemde (ör. sıralama) ekrandaki iyimser durumu sunucudakiyle eşitle.
      if (result.error) router.refresh();
    });
  };

  const reorder = (table: Table) => (ids: string[]) => quick(() => reorderAction(table, ids));

  const rowActions = (table: Table, id: string, label: string, onEdit: () => void) => (
    <div className="flex shrink-0 items-center">
      <button type="button" className={iconButton} onClick={onEdit} aria-label="Düzenle">✎</button>
      <button
        type="button"
        className={`${iconButton} hover:text-red-600`}
        disabled={pending}
        onClick={() => quick(() => deleteAction(table, id), `"${label}" silinsin mi? Bu işlem geri alınamaz.`)}
        aria-label="Sil"
      >
        🗑
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Menü Yönetimi</h1>
          <p className="mt-1 text-sm text-brand-muted">Değişiklikler kaydedildiği anda menüde görünür.</p>
        </div>
        <button
          type="button"
          onClick={() => logoutAction()}
          className="shrink-0 cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium"
        >
          Çıkış
        </button>
      </header>

      <div className="mt-5 flex gap-2">
        {(
          [
            ["content", "İçerik"],
            ["prices", "Toplu Fiyat"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium ${
              tab === key ? "border-brand-dark bg-brand-dark text-brand-gold-soft" : "border-black/10 bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "prices" ? (
        <PriceForm categories={categories} priceDate={priceDate} />
      ) : (
        <>
          <p className="mt-4 text-xs text-brand-muted">
            Sıralamayı değiştirmek için satırlardaki ⠿ tutamacından tutup sürükleyin.
          </p>
          <div>
            <SortableList items={categories} as="section" itemClassName="mt-8 bg-brand-cream" onReorder={reorder("categories")}>
              {(category, handle) => (
                <>
                  <div className="flex items-center gap-2">
                    <DragHandle handle={handle} label={category.name.tr} />
                    <h2 className="font-display flex min-w-0 flex-1 items-center gap-2 text-xl font-bold text-brand-dark">
                      <span aria-hidden>{category.icon}</span>
                      <span className="truncate">{category.name.tr}</span>
                      {!category.active && (
                        <span className="rounded-md bg-black/10 px-2 py-0.5 font-sans text-xs font-bold text-brand-muted">GİZLİ</span>
                      )}
                    </h2>
                    {rowActions("categories", category.id, category.name.tr, () => setEditor({ kind: "category", category }))}
                  </div>

                  <div>
                    <SortableList items={category.groups} itemClassName="mt-3 bg-brand-cream" onReorder={reorder("menu_groups")}>
                      {(group, groupHandle) => {
                        const title = group.title?.tr ?? "Başlıksız bölüm";
                        return (
                          <>
                            <div className="mb-2 flex items-center gap-2">
                              <DragHandle handle={groupHandle} label={title} />
                              <h3 className="min-w-0 flex-1">
                                <span className="inline-block rounded-md bg-brand-gold/25 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
                                  {title}
                                </span>
                              </h3>
                              {rowActions("menu_groups", group.id, title, () =>
                                setEditor({ kind: "group", categoryId: category.id, group }),
                              )}
                            </div>
                            <ul className="rounded-2xl bg-brand-paper shadow-sm ring-1 ring-black/5">
                              <SortableList
                                items={group.items}
                                as="li"
                                itemClassName="flex items-center gap-2 border-b border-black/5 bg-brand-paper px-2 py-2.5 first:rounded-t-2xl"
                                onReorder={reorder("menu_items")}
                              >
                                {(item, itemHandle) => (
                                  <>
                                    <DragHandle handle={itemHandle} label={item.name.tr} />
                                    {item.imageUrl ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={item.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                                    ) : (
                                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-black/5 text-xs text-brand-muted">—</div>
                                    )}
                                    <div className={`min-w-0 flex-1 ${item.available ? "" : "opacity-50"}`}>
                                      <p className="truncate font-medium leading-snug">{item.name.tr}</p>
                                      <p className="text-xs text-brand-muted">
                                        {item.price === null ? "Fiyat yok" : `${item.price.toLocaleString("tr-TR")} ₺`}
                                        {!item.name.en || !item.name.ar ? " · çeviri eksik" : ""}
                                      </p>
                                    </div>
                                    <label className="flex shrink-0 cursor-pointer items-center gap-1 text-xs text-brand-muted">
                                      <input
                                        key={String(item.available)}
                                        type="checkbox"
                                        defaultChecked={item.available}
                                        disabled={pending}
                                        onChange={(event) => quick(() => toggleItemAvailableAction(item.id, event.target.checked))}
                                      />
                                      Satışta
                                    </label>
                                    {rowActions("menu_items", item.id, item.name.tr, () =>
                                      setEditor({ kind: "item", groupId: group.id, item }),
                                    )}
                                  </>
                                )}
                              </SortableList>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => setEditor({ kind: "item", groupId: group.id })}
                                  className="w-full cursor-pointer rounded-b-2xl px-4 py-2.5 text-left text-sm font-medium text-brand-dark hover:bg-black/5"
                                >
                                  + Ürün ekle
                                </button>
                              </li>
                            </ul>
                          </>
                        );
                      }}
                    </SortableList>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditor({ kind: "group", categoryId: category.id })}
                    className="mt-3 cursor-pointer rounded-xl border border-dashed border-black/20 px-4 py-2 text-sm font-medium text-brand-dark"
                  >
                    + Alt başlık ekle
                  </button>
                </>
              )}
            </SortableList>
          </div>

          <button
            type="button"
            onClick={() => setEditor({ kind: "category" })}
            className="mt-10 w-full cursor-pointer rounded-2xl border-2 border-dashed border-black/20 py-4 font-semibold text-brand-dark"
          >
            + Kategori ekle
          </button>
        </>
      )}

      {(notice.error || notice.success) && tab === "content" && (
        <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-brand-cream/95 backdrop-blur">
          <p className={`mx-auto max-w-3xl px-4 py-3 text-sm font-medium ${notice.error ? "text-red-600" : "text-green-700"}`}>
            {notice.error ?? notice.success}
          </p>
        </div>
      )}

      {editor && (
        <EditorDialog
          key={JSON.stringify(editor)}
          editor={editor}
          onClose={() => setEditor(null)}
          onSaved={(state) => {
            setNotice(state);
            setEditor(null);
          }}
        />
      )}
    </div>
  );
}

function LocalizedInputs({
  field,
  label,
  value,
  required,
  multiline,
}: {
  field: string;
  label: string;
  value: Localized | null | undefined;
  required?: boolean;
  multiline?: boolean;
}) {
  const langs = [
    ["tr", "Türkçe"],
    ["en", "English"],
    ["ar", "العربية"],
  ] as const;

  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-muted">{label}</legend>
      {langs.map(([lang, langLabel]) => {
        const props = {
          name: `${field}_${lang}`,
          defaultValue: value?.[lang] ?? "",
          placeholder: langLabel,
          // Otomatik çeviri, değişikliği önceki Türkçe metinle karşılaştırarak bulur.
          "data-original": value?.[lang] ?? "",
          required: required && lang === "tr",
          dir: lang === "ar" ? "rtl" : "ltr",
          "aria-label": `${label} (${langLabel})`,
          className: inputClass,
        } as const;
        return multiline ? <textarea key={lang} rows={2} {...props} /> : <input key={lang} type="text" {...props} />;
      })}
    </fieldset>
  );
}

type TextField = HTMLInputElement | HTMLTextAreaElement;

/** Formdaki tüm Türkçe alanları İngilizce ve Arapçaya çevirip ilgili kutulara yazar (kaydetmez). */
function TranslateButton({ formRef }: { formRef: React.RefObject<HTMLFormElement | null> }) {
  const [message, setMessage] = useState<ActionState>({});
  const [pending, startTransition] = useTransition();

  const translate = () => {
    const form = formRef.current;
    if (!form) return;
    const field = (name: string) => form.elements.namedItem(name) as TextField | null;

    const keys = [...form.querySelectorAll<TextField>("[name$='_tr']")].map((el) => el.name.slice(0, -3));
    const fields = keys.map((key) => ({
      key,
      tr: field(`${key}_tr`)?.value ?? "",
      previousTr: field(`${key}_tr`)?.dataset.original ?? "",
      en: field(`${key}_en`)?.value ?? "",
      ar: field(`${key}_ar`)?.value ?? "",
    }));

    setMessage({});
    startTransition(async () => {
      const result = await translateAction(fields);
      if (!result.ok) {
        setMessage({ error: result.error });
        return;
      }
      for (const [key, value] of Object.entries(result.fields)) {
        for (const lang of ["en", "ar"] as const) {
          const el = field(`${key}_${lang}`);
          if (!el || el.value === value[lang]) continue;
          el.value = value[lang];
          el.classList.add("!border-brand-gold", "!bg-brand-gold/10");
        }
      }
      setMessage({ success: "Çeviriler dolduruldu. Renkli kutular değişti; kontrol edip kaydedin." });
    });
  };

  return (
    <div className="rounded-xl bg-white/60 p-3 ring-1 ring-black/5">
      <button
        type="button"
        onClick={translate}
        disabled={pending}
        className="cursor-pointer rounded-lg border border-brand-dark/30 bg-white px-3 py-2 text-sm font-semibold text-brand-dark disabled:opacity-60"
      >
        {pending ? "Çevriliyor…" : "🌐 Türkçeden çevir (EN + AR)"}
      </button>
      <p className={`mt-1.5 text-xs ${message.error ? "text-red-600" : message.success ? "text-green-700" : "text-brand-muted"}`}>
        {message.error ??
          message.success ??
          "Türkçeyi değiştirdikten sonra basın. Mevcut çevirilerde yalnızca değişen kısım güncellenir."}
      </p>
    </div>
  );
}

function EditorDialog({
  editor,
  onClose,
  onSaved,
}: {
  editor: Editor;
  onClose: () => void;
  onSaved: (state: ActionState) => void;
}) {
  const action =
    editor.kind === "category" ? saveCategoryAction : editor.kind === "group" ? saveGroupAction : saveItemAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (state.success) onSaved(state);
  }, [state, onSaved]);

  const existing = editor.kind === "category" ? editor.category : editor.kind === "group" ? editor.group : editor.item;
  const noun = { category: "Kategori", group: "Alt başlık", item: "Ürün" }[editor.kind];

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-brand-cream p-0 shadow-xl backdrop:bg-black/40"
    >
      <form ref={formRef} action={formAction} className="max-h-[85vh] space-y-4 overflow-y-auto p-5">
        <h2 className="font-display text-xl font-bold text-brand-dark">
          {existing ? `${noun} düzenle` : `${noun} ekle`}
        </h2>
        {existing && <input type="hidden" name="id" value={existing.id} />}

        {editor.kind === "category" && (
          <>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-muted">Simge (emoji)</span>
              <input name="icon" defaultValue={editor.category?.icon ?? "🍽️"} className={`${inputClass} w-24`} />
            </label>
            <LocalizedInputs field="name" label="Kategori adı" value={editor.category?.name} required />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_active" defaultChecked={editor.category?.active ?? true} />
              Menüde göster
            </label>
          </>
        )}

        {editor.kind === "group" && (
          <>
            <input type="hidden" name="category_id" value={editor.categoryId} />
            <LocalizedInputs field="title" label="Alt başlık (boş bırakılabilir)" value={editor.group?.title} />
          </>
        )}

        {editor.kind === "item" && (
          <>
            <input type="hidden" name="group_id" value={editor.groupId} />
            <LocalizedInputs field="name" label="Ürün adı" value={editor.item?.name} required />
            <LocalizedInputs field="note" label="Açıklama / içindekiler" value={editor.item?.note} multiline />
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-muted">Fiyat (₺, boşsa gösterilmez)</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                name="price"
                defaultValue={editor.item?.price ?? ""}
                className={`${inputClass} w-40 tabular-nums`}
              />
            </label>
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-muted">Fotoğraf</span>
              {editor.item?.imageUrl && (
                <div className="mb-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editor.item.imageUrl} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="remove_image" />
                    Fotoğrafı kaldır
                  </label>
                </div>
              )}
              <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" className="text-sm" />
              <p className="mt-1 text-xs text-brand-muted">JPG, PNG veya WebP · en fazla 5 MB</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_available" defaultChecked={editor.item?.available ?? true} />
              Satışta (işaret kaldırılırsa &quot;Tükendi&quot; görünür)
            </label>
          </>
        )}

        <TranslateButton formRef={formRef} />

        {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => dialogRef.current?.close()} className="cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2.5 font-medium">
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={pending}
            className="cursor-pointer rounded-xl bg-brand-dark px-5 py-2.5 font-semibold text-brand-gold-soft disabled:opacity-60"
          >
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function PriceForm({ categories, priceDate }: { categories: MenuCategory[]; priceDate: string }) {
  const [state, action, pending] = useActionState(savePricesAction, initial);

  return (
    <form action={action}>
      <label className="mt-5 block rounded-2xl bg-brand-paper p-4 shadow-sm ring-1 ring-black/5">
        <span className="text-xs font-bold uppercase tracking-wide text-brand-muted">Fiyat geçerlilik tarihi</span>
        <input
          type="text"
          name="priceDate"
          defaultValue={priceDate}
          placeholder="04.02.2026"
          className={`${inputClass} mt-2 w-40`}
        />
      </label>

      {categories.map((category) => (
        <section key={category.id} className="mt-8">
          <h2 className="font-display flex items-center gap-2 text-xl font-bold text-brand-dark">
            <span aria-hidden>{category.icon}</span>
            {category.name.tr}
          </h2>
          {category.groups.map((group) => (
            <div key={group.id} className="mt-3">
              {group.title && (
                <h3 className="mb-2 inline-block rounded-md bg-brand-gold/25 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
                  {group.title.tr}
                </h3>
              )}
              <ul className="overflow-hidden rounded-2xl bg-brand-paper shadow-sm ring-1 ring-black/5">
                {group.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 border-b border-black/5 px-4 py-3 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{item.name.tr}</p>
                      {item.note && <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-brand-muted">{item.note.tr}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        name={`price:${item.id}`}
                        defaultValue={item.price ?? ""}
                        aria-label={`${item.name.tr} fiyatı`}
                        className="w-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-right text-base tabular-nums outline-none focus:border-brand-gold"
                      />
                      <span className="text-sm text-brand-muted">₺</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-brand-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1 text-sm">
            {state.error && <p className="font-medium text-red-600">{state.error}</p>}
            {state.success && <p className="font-medium text-green-700">{state.success}</p>}
            {!state.error && !state.success && <p className="text-brand-muted">Tüm fiyatları tek seferde kaydedin.</p>}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 cursor-pointer rounded-xl bg-brand-dark px-5 py-3 font-semibold text-brand-gold-soft disabled:opacity-60"
          >
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}
