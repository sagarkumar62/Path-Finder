from pydantic import BaseModel
from typing import List


class SkillTaxonomyItem(BaseModel):
    name: str
    aliases: List[str]


class SkillTaxonomy(BaseModel):
    skills: List[SkillTaxonomyItem]
