import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreatePostDto } from '../api/dtos/create-post.dto';
import { UpdatePostDto } from '../api/dtos/update-post.dto';
import slugify from 'slugify';
@Injectable()
export class PostQuery {
  constructor(private prisma: PrismaService) { }
  // 🟩 Lấy danh sách bài viết
  async findAll(category?: string, visibility?: boolean) {
    const where: any = {
      deletedAt: null,
    };

    if (category && category !== 'all') {
      where.category = { name: category };
    }

    if (visibility !== undefined) {
      where.visibility = Boolean(visibility);

    }

    return this.prisma.post.findMany({
      include: {
        category: true,
        createdByUser: true,
        postTags: {
          include: { tag: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      where,
    });
  }


  // 🟦 Lấy chi tiết 1 bài viết
  async findById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        createdByUser: true,
        postTags: {
          include: { tag: true },
        },
      },
    });

    if (!post) throw new NotFoundException('News Post not found');
    return post;
  }
  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        createdByUser: true,
        postTags: {
          include: { tag: true },
        },
      },
    });

    if (!post) throw new NotFoundException('News Post not found');
    return post;
  }

  // 🟨 Tạo mới bài viết
  async create(dto: CreatePostDto) {
    console.log('📦 DTO nhận được trong PostQuery.create:', dto);
    return this.prisma.post.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title, { lower: true, strict: true }),
        thumbnail: dto.thumbnail,
        content: dto.content,
        visibility: dto.visibility ?? true,
        view: dto.view ?? 0,
        pin: dto.pin ?? false,
        pin_to_home: dto.pin_to_home ?? false,
        categoryId: dto.categoryId,
        createdBy: dto.createdBy,
        postTags: dto.tagIds
          ? { create: dto.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: true,
        createdByUser: true,
        postTags: {
          include: { tag: true },
        },
      },
    });
  }

  // 🟧 Cập nhật bài viết
  async update(id: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) throw new NotFoundException('News Post not found');

    return this.prisma.post.update({
      where: { id: Number(id) },
      data: {
        title: dto.title,
        slug: slugify(dto.title, { lower: true, strict: true }),
        thumbnail: dto.thumbnail,
        content: dto.content,
        visibility: dto.visibility,
        view: dto.view,
        pin: dto.pin,
        pin_to_home: dto.pin_to_home,
        categoryId: dto.categoryId,
        postTags: dto.tagIds
          ? {
            deleteMany: {},
            create: dto.tagIds.map((tagId) => ({ tagId })),
          }
          : undefined,
      },
      include: {
        category: true,
        createdByUser: true,
        postTags: {
          include: { tag: true },
        },
      },
    });
  }

  // 🟥 Xóa mềm bài viết
  async delete(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) throw new NotFoundException('News Post not found');

    return this.prisma.post.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }
}
