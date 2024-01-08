export class CreateNoteDto {
  constructor(
    public title: string,
    public description: string,
    public ownerId: string,
  ) {}
}
