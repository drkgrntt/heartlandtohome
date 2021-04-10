import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Section } from './Section'
import * as types from '@/types'

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  className!: string

  @Column({ default: '', unique: true })
  @Index()
  route!: string

  @Column('int', { default: 0 })
  navOrder!: number

  @Column('text', { default: '' })
  css!: string

  @Column({ default: false })
  omitDefaultHeader!: boolean

  @Column({ default: false })
  omitDefaultFooter!: boolean

  @ManyToOne(() => Section, (section) => section.page, {
    onDelete: 'CASCADE',
  })
  sections!: Section[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Page> {
    let sectionEntities = await Section.find({
      where: {
        pageId: this.id,
      },
      order: { order: 'ASC' },
    })
    const sections = sectionEntities.map((section) =>
      section.toModel()
    )

    return {
      id: this.id,
      title: this.title,
      className: this.className,
      route: this.route,
      navOrder: this.navOrder,
      css: this.css,
      omitDefaultHeader: this.omitDefaultHeader,
      omitDefaultFooter: this.omitDefaultFooter,
      sections,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(page: types.Page): Promise<types.Page> {
    let foundPage = await Page.findOne({
      where: {
        id: page.id,
      },
    })

    if (!foundPage) {
      foundPage = Page.create()
    }

    foundPage.title = page.title
    foundPage.className = page.className
    foundPage.route = page.route
    foundPage.navOrder = page.navOrder
    foundPage.css = page.css
    foundPage.omitDefaultHeader = page.omitDefaultHeader
    foundPage.omitDefaultFooter = page.omitDefaultFooter

    foundPage = await foundPage.save()

    for (const section of page.sections) {
      await Section.saveFromModel(section)
    }

    return await foundPage.toModel()
  }
}
