declare module 'sanitize-html' {
  export interface IOptions {
    allowedTags?: string[] | false;
    allowedAttributes?: Record<string, string[]> | false;
    allowedSchemes?: string[] | boolean;
    allowedSchemesAppliedToAttributes?: string[];
    allowProtocolRelative?: boolean;
    disallowedTagsMode?:
      | 'discard'
      | 'escape'
      | 'recursiveEscape'
      | 'completelyDiscard';
    [key: string]: any;
  }

  function sanitizeHtml(dirty: string, options?: IOptions): string;
  export default sanitizeHtml;
}
