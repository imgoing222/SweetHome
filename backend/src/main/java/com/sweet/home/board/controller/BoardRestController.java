package com.sweet.home.board.controller;

import com.sweet.home.board.controller.dto.request.BoardSaveRequest;
import com.sweet.home.board.controller.dto.response.BoardResponse;
import com.sweet.home.board.service.BoardService;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BoardRestController {

    private final BoardService boardService;

    public BoardRestController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/boards")
    public ResponseEntity<List<BoardResponse>> showBoard() {
        return ResponseEntity.ok().body(boardService.findAllBoards());
    }

    @PostMapping("/boards")
    public ResponseEntity<Void> createBoard(@RequestBody BoardSaveRequest request) {
        boardService.saveBoard(request);
        URI uri = URI.create("/api/boards");
        return ResponseEntity.created(uri).build();
    }
}