// Model for Document
export default class Document {
  constructor({ id, title, type, date, fileUri }) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.date = date;
    this.fileUri = fileUri;
  }
}
