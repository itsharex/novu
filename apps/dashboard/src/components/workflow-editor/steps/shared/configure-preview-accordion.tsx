import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Code2 } from '@/components/icons/code-2';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/primitives/accordion';
import { Button } from '@/components/primitives/button';
import { Editor } from '@/components/primitives/editor';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

const extensions = [loadLanguage('json')?.extension ?? []];

type ConfigurePreviewAccordionProps = {
  editorValue: string;
  setEditorValue: (value: string) => void;
  onUpdate: () => void;
};

export const ConfigurePreviewAccordion = ({
  editorValue,
  setEditorValue,
  onUpdate,
}: ConfigurePreviewAccordionProps) => {
  const [accordionValue, setAccordionValue] = useState<string | undefined>('payload');
  const [payloadError, setPayloadError] = useState('');
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [editorValue]);

  return (
    <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
      <AccordionItem value="payload">
        <AccordionTrigger>
          <div className="flex items-center gap-1">
            <Code2 className="size-5" />
            Configure preview
          </div>
        </AccordionTrigger>
        <AccordionContent
          ref={contentRef}
          className="flex flex-col gap-2"
          style={{ '--radix-collapsible-content-height': `${height}px` } as CSSProperties}
        >
          <Editor
            value={editorValue}
            onChange={setEditorValue}
            lang="json"
            extensions={extensions}
            className="border-neutral-alpha-200 bg-background text-foreground-600 mx-0 mt-0 rounded-lg border border-dashed p-3"
          />
          {payloadError && <p className="text-destructive text-xs">{payloadError}</p>}
          <Button
            size="xs"
            type="button"
            variant="outline"
            className="self-end"
            onClick={() => {
              try {
                onUpdate();
                setPayloadError('');
              } catch (e) {
                setPayloadError(String(e));
              }
            }}
          >
            Apply
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
