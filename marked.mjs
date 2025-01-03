#!/usr/bin/env node

import { marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'

marked.use(gfmHeadingId())

import 'marked/bin/marked'
