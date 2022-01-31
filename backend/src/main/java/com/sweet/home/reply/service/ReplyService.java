package com.sweet.home.reply.service;

import com.sweet.home.comment.domain.Comment;
import com.sweet.home.comment.service.CommentService;
import com.sweet.home.member.domain.Member;
import com.sweet.home.member.service.MemberService;
import com.sweet.home.reply.controller.dto.request.ReplySaveRequest;
import com.sweet.home.reply.domain.Reply;
import com.sweet.home.reply.domain.ReplyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final MemberService memberService;
    private final CommentService commentService;

    public ReplyService(ReplyRepository replyRepository, MemberService memberService, CommentService commentService) {
        this.replyRepository = replyRepository;
        this.memberService = memberService;
        this.commentService = commentService;
    }

    @Transactional
    public void createReply(String email, Long commentId, ReplySaveRequest request) {
        Member member = memberService.findByEmail(email);
        Comment comment = commentService.findById(commentId);

        Reply reply = Reply.builder()
            .member(member)
            .comment(comment)
            .content(request.getContent())
            .build();
        replyRepository.save(reply);
    }
}