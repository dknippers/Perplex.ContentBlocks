import type { UmbPropertyDatasetContext, UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import type { UmbBlockDataModel } from "@umbraco-cms/backoffice/block";
import {
    Observable,
    UmbArrayState,
    UmbBooleanState,
    UmbObjectState,
    UmbStringState,
} from "@umbraco-cms/backoffice/observable-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { create } from "mutative";
import { PerplexContentBlocksBlock, PerplexContentBlocksBlockOnChangeFn } from "./perplex-content-blocks";

export class PerplexContentBlocksPropertyDatasetContext extends UmbControllerBase implements UmbPropertyDatasetContext {
    #block: PerplexContentBlocksBlock;
    #content: UmbObjectState<UmbBlockDataModel>;
    #token = new UmbContextToken<PerplexContentBlocksPropertyDatasetContext>("UmbPropertyDatasetContext");
    #properties = new UmbArrayState<UmbPropertyValueData>([], x => x.alias);

    #onChange: (block: PerplexContentBlocksBlock) => void;

    getVariantId() {
        return UmbVariantId.CreateInvariant();
    }
    getEntityType() {
        return "element";
    }
    getUnique() {
        return this.#block.id;
    }

    getName(): string | undefined {
        return "TODO: ContentBlocks name";
    }

    constructor(
        host: UmbControllerHost,
        block: PerplexContentBlocksBlock,
        onChange: PerplexContentBlocksBlockOnChangeFn
    ) {
        super(host);

        this.#block = block;
        this.#content = new UmbObjectState<UmbBlockDataModel>(this.#block.content);
        this.#onChange = onChange;

        this.properties = this.#properties.asObservable();

        this.provideContext(this.#token, this);
    }
    getReadOnly(): boolean {
        throw new Error("Method not implemented.");
    }

    readonly properties: Observable<Array<UmbPropertyValueData> | undefined>;
    getProperties(): Promise<Array<UmbPropertyValueData> | undefined> {
        return Promise.resolve(this.#properties.getValue());
    }

    readOnly: Observable<boolean> = new UmbBooleanState(false).asObservable();

    readonly name: Observable<string | undefined> = new UmbStringState(this.getName()).asObservable();

    propertyVariantId?: ((propertyAlias: string) => Promise<Observable<UmbVariantId | undefined>>) | undefined;

    cleanAlias(alias: string): string {
        // Skip past the '<BLOCK_ID>_' part.
        return alias.substring(37);
    }

    async propertyValueByAlias<ReturnType = unknown>(propertyAlias: string) {
        const alias = this.cleanAlias(propertyAlias);
        return this.#content.asObservablePart(
            c => c.values.find(v => v.alias === alias && v.culture == null && v.segment == null)?.value as ReturnType
        );
    }

    async setPropertyValue(propertyAlias: string, value: unknown) {
        const alias = this.cleanAlias(propertyAlias);
        const updated = create(this.#content.getValue(), content => {
            let item = content.values.find(v => v.alias === alias && v.culture == null && v.segment == null);
            if (item == null) {
                item = { alias, editorAlias: "", culture: null, segment: null };
                content.values.push(item);
            }

            item.value = value;
        });
        this.#content.setValue(updated);
        this.#block = { ...this.#block, content: updated };
        this.#onChange(this.#block);
    }
}
