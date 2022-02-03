package com.sweet.home.article.service;

import com.sweet.home.article.controller.dto.response.ArticleLikeResponse;
import com.sweet.home.article.domain.Article;
import com.sweet.home.article.domain.ArticleLike;
import com.sweet.home.article.domain.ArticleLikeRepository;
import com.sweet.home.global.exception.BusinessException;
import com.sweet.home.global.exception.ErrorCode;
import com.sweet.home.member.domain.Member;
import com.sweet.home.member.service.MemberService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArticleLikeService {

    private final ArticleLikeRepository articleLikeRepository;
    private final MemberService memberService;
    private final ArticleService articleService;

    public ArticleLikeService(ArticleLikeRepository articleLikeRepository, MemberService memberService,
        ArticleService articleService) {
        this.articleLikeRepository = articleLikeRepository;
        this.memberService = memberService;
        this.articleService = articleService;
    }

    @Transactional
    public void likeArticle(String email, Long articleId) {
        Member member = memberService.findByEmail(email);
        Article article = articleService.findById(articleId);

        checkNotLiked(member, article);
        ArticleLike articleLike = ArticleLike.builder()
            .member(member)
            .article(article)
            .build();
        articleLikeRepository.save(articleLike);
    }

    private void checkNotLiked(Member member, Article article) {
        if (articleLikeRepository.existsByMemberAndArticle(member, article)) {
            throw new BusinessException(ErrorCode.ARTICLE_LIKE_ALREADY_EXISTS);
        }
    }

    @Transactional(readOnly = true)
    public boolean showArticleLikeStatus(String email, Long articleId) {
        Member member = memberService.findByEmail(email);
        Article article = articleService.findById(articleId);
        return articleLikeRepository.existsByMemberAndArticle(member, article);
    }

    @Transactional(readOnly = true)
    public List<ArticleLikeResponse> showArticleLikes(String email, Pageable pageable) {
        Member member = memberService.findByEmail(email);
        return articleLikeRepository.findAllByMember(member, pageable).stream()
            .map(ArticleLikeResponse::from)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteLike(String email, Long articleId) {
        Member member = memberService.findByEmail(email);
        Article article = articleService.findById(articleId);

        ArticleLike articleLike = articleLikeRepository.findByMemberAndArticle(member, article)
            .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_LIKE_NOT_FOUND));
        articleLike.saveDeletedTime();
    }
}